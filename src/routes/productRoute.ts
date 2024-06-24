import express, { Router } from "express";
import AuthMiddleware, { Role } from "../middleware/authMiddleware";
import ProductController from "../controllers/productController";
import { multer, storage } from "../middleware/multerMiddleware";

const upload = multer({ storage: storage });
const router: Router = express.Router();

// only admin allowed
router
  .route("/")
  .post(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    upload.single("productImage"),
    ProductController.addProduct
  )
  .get(ProductController.getAllProducts);

// product herna pye but delete garna na paye
//because of due to Admin Role
router
  .route("/:id")
  .get(ProductController.getSingleProduct)
  .delete(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    ProductController.deleteProduct
  )
  .patch(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    upload.single("productImage"), 
    ProductController.updateProduct
  );

export default router;
