import express from "express";
import { Request, Response, NextFunction, Application } from "express";

const app: Application = express();
import * as dotenv from "dotenv";
dotenv.config();
app.use(express.json());

const PORT: number = 3000;
import "./database/connection"
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log(`hello world`);
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
