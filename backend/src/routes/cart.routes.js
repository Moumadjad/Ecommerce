import { Router } from "express";
import {
  addItem,
  clearCart,
  getCart,
  mergeCart,
  removeItem,
  updateItem,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getCart);
router.post("/items", addItem);
router.put("/items/:productId", updateItem);
router.delete("/items/:productId", removeItem);
router.delete("/", clearCart);
router.post("/merge", mergeCart);

export default router;
