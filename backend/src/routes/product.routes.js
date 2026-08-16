import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { adminOnly, optionalAuth, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", optionalAuth, getProducts);
router.get("/:id", optionalAuth, getProductById);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
