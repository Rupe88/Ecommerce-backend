import { Request, Response } from "express";
import Product from "../database/models/productModel";
import User from "../database/models/userModel";
import { AuthRequest } from "../middleware/authMiddleware";
import Category from "../database/models/categoryModel";

class ProductController {
  public static async addProduct(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user?.id; // for foreign key id
    const {
      productName,
      productDescription,
      productTotalStoksQty,
      productPrice,
      categoryId,
    } = req.body;

    // product image
    let fileName;
    if (req.file) {
      fileName = req.file?.filename;
    } else {
      fileName =
        "https://t4.ftcdn.net/jpg/03/28/37/93/360_F_328379347_xEKgEB2wkjAJmcqSTmrg4uKxfWrlL7D9.jpg";
    }

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productTotalStoksQty ||
      !categoryId
    ) {
      res.status(400).json({
        message:
          "please provide productName, productDescription, productTotalStockQty, productPrice, categoryId",
      });
      return;
    }
    await Product.create({
      productName,
      productDescription,
      productTotalStoksQty,
      productPrice,
      productImage: fileName,
      userId: userId,
      categoryId: categoryId,
    });
    res.status(200).json({
      message: "Product added successfully",
    });
  }

  public static async getAllProducts(
    req: Request,
    res: Response
  ): Promise<void> {
    const data = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ['id','email', 'username'], // Ensure 'username' is included
        },
        {
          model:Category,
          attributes:["id", "categoryName"]
         
        }
      ],
    });
    res.status(200).json({
      message: "Products fetched successfully",
      data,
    });
  }
}

export default ProductController;
