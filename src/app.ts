import express from "express";
import { Application } from "express";
import userRoute from "./routes/userRoute";
const app: Application = express();
import * as dotenv from "dotenv";
dotenv.config();
app.use(express.json());

const port = process.env.PORT || 3000



app.use("", userRoute);

//listening
import "./database/connection";
import adminSeeder from "./adminSeeder";

//admin
adminSeeder();
app.listen(port, () => {

  console.log(`server is running on http://localhost:${port}`);
});
