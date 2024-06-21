import express from "express";
import { Request, Response, NextFunction, Application } from "express";
import userRoute from "./routes/userRoute";
const app: Application = express();
import * as dotenv from "dotenv";
dotenv.config();
app.use(express.json());

const PORT: number = 3000;

// test
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log(`hello world`);
});

app.use("", userRoute);

//listening
import "./database/connection";
app.listen(PORT, () => {

  console.log(`server is running on http://localhost:${PORT}`);
});
