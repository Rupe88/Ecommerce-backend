import express from "express";
import { Application } from "express";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import categoryRoute from "./routes/categoryRoute";
import cartRoute from "./routes/cartRoute";

const app: Application = express();
import * as dotenv from "dotenv";

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use("", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category", categoryRoute);
app.use("/customer/cart", cartRoute);

//listening
import "./database/connection";
import adminSeeder from "./adminSeeder";
import categoryController from "./controllers/categoryController";

//admin
adminSeeder();

app.listen(port, () => {
  categoryController.seedCategory();
  console.log(`server is running on http://localhost:${port}`);
});
