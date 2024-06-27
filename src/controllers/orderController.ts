import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { OrderData, PaymentMethod } from "../types/orderTypes";
import Order from "../database/models/orderModel";
import Payment from "../database/models/paymentModel";
import OrderDetail from "../database/models/orderDetailsModel";
import axios from "axios";

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
      !paymentDetails ||
      !paymentDetails.paymentMethod ||
      items.length == 0
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber,shippingAddress,totalAmount,paymentDetails,items",
      });
      return;
    }

    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      orderStatus: 'pending',
    });

    await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
    });
    for (let i = 0; i < items.length; i++) {
      await OrderDetail.create({
        quantity: items[i].quantity,
        productId: items[i].productId,
        orderId: orderData.id,
      });
    }

    if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
      //khalti intregation
      const data={
        return_url:"http://localhost:8000/success",
        purchase_order_id:orderData.id,
        amount: totalAmount * 100,
        website_url:"http://localhost:8000/",
        purchase_order_name:"orderName_" + orderData.id

      }
     const response= await axios.post('https://a.khalti.com/api/v2/epayment/initiate/',data,{
        headers:{
            'Authorization':'key live_secret_key_68791341fdd94846a146f0457ff7b455',
            'Content-Type': 'application/json',
        }
      })
      console.log(response
      )

    } else {
      res.status(200).json({
        message: "order placed successfully",
      });
    }
  }
}

export default new OrderController();
