import express, { Router } from "express";
import AuthMiddleware, { Role } from "../middleware/authMiddleware";
import categoryController from "../controllers/categoryController";

const router: Router = express.Router();

// only admin allowed
router
  .route("/")
  .post(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    categoryController.addCategory
  )
  .get(categoryController.getCategory);

router
  .route("/:id")
  .delete(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    categoryController.deleteCategory
  )
  .patch(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    categoryController.updateCategory
  );

export default router;
