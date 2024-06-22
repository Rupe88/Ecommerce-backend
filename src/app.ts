import express from "express";
import { Application } from "express";
import userRoute from "./routes/userRoute";
const app: Application = express();
import * as dotenv from "dotenv";
dotenv.config();
app.use(express.json());

const PORT: number = 3000 || process.env.PORT;



app.use("", userRoute);

//listening
import "./database/connection";
import adminSeeder from "./adminSeeder";

//admin
adminSeeder();
app.listen(PORT, () => {

  console.log(`server is running on http://localhost:${PORT}`);
});
