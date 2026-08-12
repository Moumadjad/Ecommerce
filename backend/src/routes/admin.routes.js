import { Router } from "express";
import { getDashboardStats } from "../controllers/admin.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;
