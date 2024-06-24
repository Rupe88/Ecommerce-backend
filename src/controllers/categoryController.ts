import Category from "../database/models/categoryModel";
import { Request, Response } from "express";
class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Food/Beverage",
    },
  ];

  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      const data = await Category.bulkCreate(this.categoryData);
      console.log("Category seeded successfully");
    } else {
      console.log("category already seeded");
    }
  }
  public static async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({
        message: "please provide a category name",
      });
      return;
    } else {
      await Category.create({
        categoryName,
      });
      res.status(200).json({
        message: "Category added success",
      });
    }
  }

  public static async getCategory(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    res.status(200).json({
      message: "Category fetched",
      data,
    });
  }

  public static async deleteCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const data = await Category.findAll({
      where: {
        id: id,
      },
    });
    if (data.length === 0) {
      res.status(403).json({
        message: "no category with that id",
      });
    } else {
      await Category.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "category created",
      });
    }
  }

  public static async updateCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const categoryName = req.body;
    await Category.update(
      {
        categoryName,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).json({
      message:"category updated"
    })
  }
}

export default new CategoryController();
