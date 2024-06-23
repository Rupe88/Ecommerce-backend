import Category from "../database/models/categoryModel";
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
}

export default new CategoryController;
