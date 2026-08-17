import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async function getUsers(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({
    users,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
});

export const updateUser = asyncHandler(async function updateUser(req, res) {
  const { role, isActive } = req.body;

  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot modify your own account" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (role !== undefined) {
    if (!["customer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be customer or admin" });
    }
    user.role = role;
  }
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();
  res.json({ user });
});

export const deleteUser = asyncHandler(async function deleteUser(req, res) {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const orderCount = await Order.countDocuments({ user: user._id });
  if (orderCount > 0) {
    return res.status(400).json({
      message: `Cannot delete a user with ${orderCount} order(s). Deactivate the account instead.`,
    });
  }

  await user.deleteOne();
  res.json({ message: "User deleted" });
});
