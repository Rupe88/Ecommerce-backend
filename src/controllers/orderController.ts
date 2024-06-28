import { KhaltiResponse, OrderData, PaymentMethod } from "./../types/orderTypes";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
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
      !paymentDetails.paymentMethod ||
      items.length === 0
    ) {
      res.status(404).json({
        message: "please provide all the data",
      });
      return;
    }
 
   const paymentData= await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,

      
    });
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      paymentId:paymentData.id
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
      const data = {
        return_url: "http://localhost:8000/success",
        purchase_order_id: orderData.id,
        amount: totalAmount * 100, //converting ruppes into poisa
        website_url: "http://localhost:8000/",
        purchase_order_name: "orderName_" + orderData.id,
      };
     const response=await axios.post("https://a.khalti.com/api/v2/epayment/initiate/",data,{
        headers:{
          "Authorization":"key 71a56624ea054ef4b09fb0cd761de5ef"
        }
      })
     const khaltiResponse:KhaltiResponse=response.data
     paymentData.pidx=khaltiResponse.pidx
     paymentData.save()
     res.status(200).json({
      message:"order placed success",
      url:khaltiResponse.payment_url
     })
    } else {
      res.status(200).json({
        message: "Order placed successfully!",
      });
    }
  }
}

export default new OrderController();
