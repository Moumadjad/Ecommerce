import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async function getProducts(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));

  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category.toLowerCase();
  }
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  const sort = req.query.sort || "-createdAt";

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
});

export const getProductById = asyncHandler(async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
});

export const createProduct = asyncHandler(async function createProduct(req, res) {
  const { name, description, price, images, category, stock } = req.body;

  if (!name || !description || price === undefined || !category) {
    return res
      .status(400)
      .json({ message: "name, description, price and category are required" });
  }

  const product = await Product.create({
    name,
    description,
    price,
    images,
    category,
    stock,
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async function updateProduct(req, res) {
  const { name, description, price, images, category, stock } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (images !== undefined) product.images = images;
  if (category !== undefined) product.category = category;
  if (stock !== undefined) product.stock = stock;

  await product.save();

  res.json({ product });
});

export const deleteProduct = asyncHandler(async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted" });
});
