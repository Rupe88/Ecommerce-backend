import express, { Router } from "express";
import AuthMiddleware, { Role } from "../middleware/authMiddleware";
import cartController from "../controllers/cartController";

const router: Router = express.Router();

router
  .route("/")
  .post(
    AuthMiddleware.isAuthenticated,
    cartController.addToCart
  );

export default router;
