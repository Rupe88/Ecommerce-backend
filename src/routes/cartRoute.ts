import express, { Router } from "express";
import AuthMiddleware, { Role } from "../middleware/authMiddleware";
import cartController from "../controllers/cartController";

const router: Router = express.Router();

router
  .route("/")
  .post(AuthMiddleware.isAuthenticated, cartController.addToCart)
  .get(AuthMiddleware.isAuthenticated, cartController.getMyCartItems);

router
  .route("/:productId")
  .patch(AuthMiddleware.isAuthenticated, cartController.updateCartItems)
  .delete(cartController.deleteCartItem);
export default router;
