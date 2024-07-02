import {
  KhaltiResponse,
  OrderData,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  TransactionStatus,
  TransactionVerificationResponse,
} from "./../types/orderTypes";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response, Request } from "express";
import Order from "../database/models/orderModel";
import Payment from "../database/models/paymentModel";
import OrderDetail from "../database/models/orderDetailsModel";
import axios from "axios";
import Product from "../database/models/productModel";
class ExtendedOrder extends Order {
  declare paymentId: string | null;
}

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      shippingAddress,
      totalAmount,
      paymentDetails,
      items,
    }: OrderData = req.body;

    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      !paymentDetails.paymentMethod ||
      items.length === 0
    ) {
      res.status(404).json({
        message: "please provide all the data",
      });
      return;
    }

    const paymentData = await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
    });
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      paymentId: paymentData.id,
    });

    for (let i = 0; i < items.length; i++) {
      await OrderDetail.create({
        quantity: items[i].quantity,
        productId: items[i].productId,
        orderId: orderData.id,
      });
    }

    if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
      // Khalti integration
      const data = {
        return_url: "http://localhost:8000/success/",
        purchase_order_id: orderData.id,
        amount: totalAmount * 100, // converting rupees into poisa
        website_url: "http://localhost:8000/",
        purchase_order_name: "orderName_" + orderData.id,
      };
      try {
        const response = await axios.post(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          data,
          {
            headers: {
              Authorization: "key 71a56624ea054ef4b09fb0cd761de5ef",
            },
          }
        );
        const khaltiResponse: KhaltiResponse = response.data;
        console.log(data);
        paymentData.pidx = khaltiResponse.pidx;
        await paymentData.save();
        res.status(200).json({
          message: "Order placed successfully",
          url: khaltiResponse.payment_url,
        });
      } catch (error) {
        console.error("Khalti initiation error:", error);
        res.status(500).json({
          message: "Failed to initiate payment",
        });
      }
    } else {
      res.status(200).json({
        message: "Order placed successfully!",
      });
    }
  }

  // Verify transaction
  async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;

    if (!pidx) {
      res.status(400).json({
        message: "Please provide pidx",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/lookup/",
        { pidx },
        {
          headers: {
            Authorization: "key 71a56624ea054ef4b09fb0cd761de5ef",
          },
        }
      );
      const data: TransactionVerificationResponse = response.data;
      console.log(data);

      if (data.status === TransactionStatus.Completed) {
        const [updatedRows] = await Payment.update(
          { paymentStatus: PaymentStatus.Paid },
          {
            where: {
              pidx: pidx,
            },
          }
        );

        if (updatedRows === 0) {
          res.status(400).json({
            message: "Payment record not found or already updated",
          });
        } else {
          res.status(200).json({
            message: "Payment verified successfully",
          });
        }
      } else {
        res.status(200).json({
          message: "Payment not verified",
        });
      }
    } catch (error) {
      console.error("Khalti verification error:", error);
      res.status(500).json({
        message: "Failed to verify payment",
      });
    }
  }

  // Fetch orders for a user
  async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Payment,
        },
      ],
    });

    if (orders.length > 0) {
      res.status(200).json({
        message: "Order fetched successfully!",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "You haven't ordered anything yet",
        data: [],
      });
    }
  }

  // Fetch order details
  async fetchOrderDetails(req: AuthRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderDetails = await OrderDetail.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Product,
        },
      ],
    });

    if (orderDetails.length > 0) {
      res.status(200).json({
        message: "Order fetched successfully",
        data: orderDetails,
      });
    } else {
      res.status(404).json({
        message: "No order details found for that ID",
        data: [],
      });
    }
  }

  // Cancel an order
  async cancelMyOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;
    const order: any = await Order.findAll({
      where: {
        userId,
        id: orderId,
      },
    });

    if (
      order?.OrderStatus === OrderStatus.Ontheway ||
      order?.OrderStatus === OrderStatus.Preparation
    ) {
      res.status(400).json({
        message:
          "You cannot cancel the order when it is on the way or being prepared",
      });
      return;
    }

    await Order.update(
      { OrderStatus: OrderStatus.Cancelled },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "Order cancelled successfully",
    });
  }
  //Customer side end here
  //admin side start here
  async changeOrderStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderStatus: OrderStatus = req.body.OrderStatus;
    await Order.update(
      {
        orderStatus: orderStatus,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "order status updated successfully",
    });
  }
  //change payment status
  async changePaymentStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const paymentStatus: PaymentStatus = req.body.paymentStatus;
    const order = await Order.findByPk(orderId);
    const extendedOrder: ExtendedOrder = order as ExtendedOrder;
    await Payment.update(
      {
        paymentStatus: paymentStatus,
      },
      {
        where: {
          id: extendedOrder.paymentId,
        },
      }
    );
    res.status(200).json({
      message: `Payment status of orderId ${orderId} successfully to ${paymentStatus} `,
    });
  }
//delete order created
  async deleteOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);
    const extendedOrder: ExtendedOrder = order as ExtendedOrder;
    if (order) {
      await Order.destroy({
        where: {
          id: orderId,
        },
      });
      await OrderDetail.destroy({
        where: {
          orderId: orderId,
        },
      });
      await Payment.destroy({
        where: {
          id: extendedOrder.paymentId,
        },
      });
      res.status(200).json({
        message: "order deleted successfully",
      });
    }else{
      message:"mo order with that orderId"
    }
  }
}

export default new OrderController();
