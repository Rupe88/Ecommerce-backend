import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import User from "../database/models/userModel";
dotenv.config();
export interface AuthRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}

export enum Role {
  Admin = "admin",
  Customer = "customer",
}

class AuthMiddleware {
    public static async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    //get token from user
    const token = req.headers.authorization;
    if (!token || token===undefined) {
      res.status(403).json({
        message: "token not provided",
      });
      return;
    }

    //verify token if it is legit or tempered
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err, decoded: any) => {
        if (err) {
          res.status(403).json({
            message: "invalid token",
          });
        } else {
          try {
            const userData = await User.findByPk(decoded.id);
            if (!userData) {
              res.status(404).json({
                message: "no user with that token",
              });
              return;
            }

            req.user = userData;
            next();
          } catch (error) {
            res.status(500).json({
              message: "Smething went Wrong",
            });
          }
        }
      }
    );
  }

 public static restrictTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "you don't have permission",
        });
      } else {
        next();
      }
    };
  }
}

export default AuthMiddleware;
