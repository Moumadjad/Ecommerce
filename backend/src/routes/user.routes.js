import { Router } from "express";
import { deleteUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, adminOnly, getUsers);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
