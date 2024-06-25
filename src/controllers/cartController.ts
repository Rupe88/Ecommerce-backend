import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";
import { AuthRequest } from "../middleware/authMiddleware";
import { Request, Response } from "express";
class CartController {
  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      res.status(404).json({
        message: "PLease provide quantity ,  productId",
      });
    }
    //check if the product is already exists or not
    let cartItem = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }else{
        //insert into the cart
      cartItem= await Cart.create({
            quantity,
            productId,
            userId
        })
    }
    res.status(200).json({
        message:"product added to cart",
        data:cartItem
    })
  }
  async getMyCartItems(req:AuthRequest, res:Response):Promise<void>{
    const userId=req.user?.id;
    const cartItems=await Cart.findAll({
        where:{
            userId
        },
        include:[
            {
                model:Product,
            }
        ]
    })
    if(cartItems.length==0){
        res.status(404).json({
            message:"no item in the cart"
        })
    }else{
        res.status(404).json({
            message:"cart item fetch successfully",
            data:cartItems
        })
    }

  }

  
}

export default new CartController;