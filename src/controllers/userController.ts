import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcryptjs";
class AuthController {
 public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "please provide username, email, password",
        success: false,
      });
      return; //exit
    }
    await User.create({
      username,
      email,
      password:bcrypt.hashSync(password, 10),
    });
    res.status(200).json({
      success: true,
      message: "user registered successfully",
    });
  }
}
export default AuthController;