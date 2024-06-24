import { NextFunction, Request, Response } from "express";
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
          attributes: ["id", "email", "username"], // Ensure 'username' is included
        },
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
      ],
    });
    res.status(200).json({
      message: "Products fetched successfully",
      data,
    });
  }
  public static async getSingleProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const data = await Product.findAll({
      where: {
        id: id,
      },
    });
    if (data.length == 0) {
      res.status(404).json({
        message: "no product with that id",
      });
    } else {
      res.status(200).json({
        message: "Product fetch success",
        data,
      });
    }
  }
  public static async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const data = await Product.findAll({
      where: {
        id: id,
      },
    });

    if (data.length > 0) {
      Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message:"Product delete successfully"
      })
    }else{
      res.status(404).json({
        message:"no product found with that id"
      })
    }
  }
}

export default ProductController;
