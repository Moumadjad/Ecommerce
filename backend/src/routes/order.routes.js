import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  payOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/", protect, adminOnly, getOrders);
router.get("/:id", protect, getOrderById);
router.post("/:id/pay", protect, payOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
