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

export default router;
