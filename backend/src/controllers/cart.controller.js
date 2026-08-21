import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

async function populateAndPrune(cart) {
  await cart.populate("items.product", "name price images stock isActive");

  const validItems = cart.items.filter((item) => item.product && item.product.isActive);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems.map((item) => ({ product: item.product._id, quantity: item.quantity }));
    await cart.save();
    await cart.populate("items.product", "name price images stock isActive");
  }

  return cart;
}

export const getCart = asyncHandler(async function getCart(req, res) {
  const cart = await populateAndPrune(await getOrCreateCart(req.user._id));
  res.json({ cart });
});

export const addItem = asyncHandler(async function addItem(req, res) {
  const { product: productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: "product and a quantity of at least 1 are required" });
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find((item) => item.product.toString() === productId);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, product.stock);
  } else {
    cart.items.push({ product: product._id, quantity: Math.min(quantity, product.stock) });
  }

  await cart.save();
  res.status(201).json({ cart: await populateAndPrune(cart) });
});

export const updateItem = asyncHandler(async function updateItem(req, res) {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "quantity must be at least 1" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    return res.status(404).json({ message: "Item not in cart" });
  }

  item.quantity = Math.min(quantity, product.stock);
  await cart.save();
  res.json({ cart: await populateAndPrune(cart) });
});

export const removeItem = asyncHandler(async function removeItem(req, res) {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();
  res.json({ cart: await populateAndPrune(cart) });
});

export const clearCart = asyncHandler(async function clearCart(req, res) {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ cart });
});

export const mergeCart = asyncHandler(async function mergeCart(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "items must be an array" });
  }

  const cart = await getOrCreateCart(req.user._id);

  for (const { product: productId, quantity } of items) {
    if (!productId || !quantity || quantity < 1) continue;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) continue;

    const existing = cart.items.find((item) => item.product.toString() === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.items.push({ product: product._id, quantity: Math.min(quantity, product.stock) });
    }
  }

  await cart.save();
  res.json({ cart: await populateAndPrune(cart) });
});
