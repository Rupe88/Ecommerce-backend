import { NextFunction, Request, Response } from "express";
import Product from "../database/models/productModel";
import User from "../database/models/userModel";
import { AuthRequest } from "../middleware/authMiddleware";
import Category from "../database/models/categoryModel";

class ProductController {
  // Existing methods...

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
      include: [
        {
          model: User,
          attributes: ["id", "email", "username"],
        },
        {
          model: Category,
        },
      ],
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
      await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "Product deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "no product found with that id",
      });
    }
  }

  // New updateProduct method
  public static async updateProduct(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
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
    }

    const updateData: any = {};
    if (productName) updateData.productName = productName;
    if (productDescription) updateData.productDescription = productDescription;
    if (productTotalStoksQty) updateData.productTotalStoksQty = productTotalStoksQty;
    if (productPrice) updateData.productPrice = productPrice;
    if (categoryId) updateData.categoryId = categoryId;
    if (fileName) updateData.productImage = fileName;

    try {
      const [updated] = await Product.update(updateData, {
        where: { id },
      });

      if (updated) {
        const updatedProduct = await Product.findOne({ where: { id } });
        res.status(200).json({
          message: "Product updated successfully",
          product: updatedProduct,
        });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error:any) {
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  }
}

export default ProductController;
