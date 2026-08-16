import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { adminOnly, optionalAuth, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", optionalAuth, getCategories);
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
