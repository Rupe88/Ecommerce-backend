import Cart from "../database/models/cartModel";
import Category from "../database/models/categoryModel";
import Product from "../database/models/productModel";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";


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
    } else {
      //insert into the cart
      cartItem = await Cart.create({
        quantity,
        productId,
        userId,
      });
    }
    res.status(200).json({
      message: "product added to cart",
      data: cartItem,
    });
  }
  async getMyCartItems(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
              attributes: ["id", "categoryName"],
            },
          ],
        },
      ],
    });
    if (cartItems.length == 0) {
      res.status(404).json({
        message: "no item in the cart",
      });
    } else {
      res.status(404).json({
        message: "cart item fetch successfully",
        data: cartItems,
      });
    }
  }
  async deleteCartItem(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { productId } = req.params;
    //check wheather above productId product exists or not
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        message: "no product with that id",
      });
      return;
    }
    //delete that productId from cart
    await Cart.destroy({
      where: {
        userId,
        productId,
      },
    });
    res.status(200).json({
      message: "cart deleted successfully",
    });
  }

  async updateCartItems(req: AuthRequest, res: Response): Promise<void> {
    //update cart items
    const {productId}=req.params;
    const userId=req.user?.id;
    const {quantity}=req.body;
    if(!quantity){
      res.status(400).json({
        message:"cart quantity not found"
    })
    return
    }
    const cartData=await Cart.findOne({
      where:{
        userId,
        productId
      }
    })
   
    if(cartData) {
      cartData.quantity=quantity
      await cartData?.save()

      res.status(200).json({
        message :"product of cart added successfully",
        data:cartData
      })
    }else{
      res.status(500).json({
        message:"no productId of that userId "
      })
    }



  
  }
}

export default new CartController();
