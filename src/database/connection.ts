import { ForeignKey, Sequelize } from "sequelize-typescript";
import User from "./models/userModel";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import Cart from "./models/cartModel";
import Order from "./models/orderModel";
import OrderDetail from "./models/orderDetailsModel";
import Payment from "./models/paymentModel";
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  models: [__dirname + "/models"],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("database is connected");
  })
  .catch((error) => {
    console.log("error in db connection", error);
  });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("migrated || sync");
  })
  .catch((error) => {
    console.log("error in db migration || sync", error);
  });

//relationships
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });
//product cart realtion
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });
//user cart relation
Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

//order details relation
Order.hasMany(OrderDetail, { foreignKey: "orderId" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

//order detail ra product ko relation
Product.hasMany(OrderDetail, {foreignKey:"productId"});
OrderDetail.belongsTo(Product, {foreignKey:"productId"});

//order ra payment ko realtion
Payment.hasOne(Order,{foreignKey:'paymentId'})
Order.belongsTo(Payment,{foreignKey:'paymentId'})



export default sequelize;
