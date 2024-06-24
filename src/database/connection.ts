import { Sequelize } from "sequelize-typescript";
import User from "./models/userModel";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  models:[__dirname + "/models"]
});

sequelize.authenticate()
.then(()=>{
    console.log("database is connected")
}).catch((error)=>{
    console.log("error in db connection", error)
})

sequelize.sync({force:false}).then(()=>{
    console.log("migrated || sync")
}).catch((error)=>{
console.log("error in db migration || sync", error)
})

//relationships
User.hasMany(Product,{foreignKey:"userId"})
Product.belongsTo(User, {foreignKey:"userId"})


Product.belongsTo(Category, {foreignKey:"categoryId"})
Category.hasOne(Product,{foreignKey:"categoryId"})

export default sequelize;