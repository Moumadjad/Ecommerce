import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const REVENUE_STATUSES = ["paid", "shipped", "delivered"];
const LOW_STOCK_THRESHOLD = 5;

export const getDashboardStats = asyncHandler(async function getDashboardStats(req, res) {
  const [statusGroups, totalProducts, totalUsers, lowStockProducts, recentOrders] =
    await Promise.all([
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } },
      ]),
      Product.countDocuments(),
      User.countDocuments(),
      Product.find({ stock: { $lte: LOW_STOCK_THRESHOLD } }).sort("stock").limit(10),
      Order.find().sort("-createdAt").limit(5).populate("user", "name email"),
    ]);

  const ordersByStatus = {};
  let totalOrders = 0;
  let totalRevenue = 0;

  for (const group of statusGroups) {
    ordersByStatus[group._id] = group.count;
    totalOrders += group.count;
    if (REVENUE_STATUSES.includes(group._id)) {
      totalRevenue += group.revenue;
    }
  }

  res.json({
    totalRevenue,
    totalOrders,
    ordersByStatus,
    totalProducts,
    totalUsers,
    lowStockProducts,
    recentOrders,
  });
});
