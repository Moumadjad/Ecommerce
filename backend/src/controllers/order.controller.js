import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must contain at least one item" });
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const { product: productId, quantity } of items) {
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Each item needs a quantity of at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: `Product not found: ${productId}` });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
    });
    totalPrice += product.price * quantity;
  }

  for (const item of orderItems) {
    await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    totalPrice,
  });

  res.status(201).json({ order });
});

export const getMyOrders = asyncHandler(async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json({ orders });
});

export const getOrders = asyncHandler(async function getOrders(req, res) {
  const orders = await Order.find().sort("-createdAt").populate("user", "name email");
  res.json({ orders });
});

export const getOrderById = asyncHandler(async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to view this order" });
  }

  res.json({ order });
});

export const payOrder = asyncHandler(async function payOrder(req, res) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to pay for this order" });
  }

  if (order.status !== "pending") {
    return res.status(400).json({ message: `Order cannot be paid because it is already ${order.status}` });
  }

  // Simulated payment: no real payment gateway, confirming always succeeds.
  order.status = "paid";
  order.paidAt = new Date();
  await order.save();

  res.json({ order });
});

export const updateOrderStatus = asyncHandler(async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  res.json({ order });
});
