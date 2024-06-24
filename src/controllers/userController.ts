import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "please provide username, email, password",
        success: false,
      });
      return; //exit
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
      return;
    }
    //user cereating
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      role: role,
    });
    res.status(200).json({
      success: true,
      message: "user registered successfully",
    });
  }

  //login

  public static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "please provide email, password",
      });
      return;
    }

    //check user exists || !
    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!data) {
      res.status(404).json({
        message: "no data with that email",
      });
      return;
    }

    //check password || compare
    const isMatched = bcrypt.compareSync(password, data.password);
    if (isMatched) {
      //generate token
      const token = jwt.sign(
        { id: data.id },
        process.env.SECRET_KEY as string,
        {
          expiresIn: "20d",
        }
      );
      res.status(200).json({
        token,
        message: "logged in Success",
      });
    } else {
      res.status(403).json({
        message: "Invalid email or password",
      });
    }
  }
}
export default AuthController;
