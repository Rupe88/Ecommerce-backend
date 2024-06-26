import express, { Router } from "express";
import AuthMiddleware, { Role } from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";
import orderController from "../controllers/orderController";

const router: Router = express.Router();

router
  .route("/")
  .post(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.createOrder)
  );

router
  .route("/verify")
  .post(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.verifyTransaction)
  );
router
  .route("/customer")
  .post(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.fetchMyOrders)
  );
router
  .route("/customer/:id")
  .patch(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Customer),
    errorHandler(orderController.cancelMyOrder)
  )
  .get(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.fetchOrderDetails)
  );

export default router;
