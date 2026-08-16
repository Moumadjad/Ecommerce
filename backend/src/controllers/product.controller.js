import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async function getProducts(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
  const includeInactive = req.query.includeInactive === "true" && req.user?.role === "admin";

  const filter = {};
  if (req.query.category) {
    const categoryIds = req.query.category.split(",").map((c) => c.trim()).filter(Boolean);
    filter.category = categoryIds.length === 1 ? categoryIds[0] : { $in: categoryIds };
  }
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  if (!includeInactive) {
    filter.isActive = true;

    const activeCategoryIds = (await Category.find({ isActive: true }).distinct("_id")).map(String);
    if (filter.category) {
      const requested = filter.category.$in || [filter.category];
      filter.category = { $in: requested.filter((id) => activeCategoryIds.includes(String(id))) };
    } else {
      filter.category = { $in: activeCategoryIds };
    }
  }

  const sort = req.query.sort || "-createdAt";

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name isActive")
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
  const includeInactive = req.query.includeInactive === "true" && req.user?.role === "admin";
  const product = await Product.findById(req.params.id).populate("category", "name isActive");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (!includeInactive && (!product.isActive || !product.category?.isActive)) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
});

export const createProduct = asyncHandler(async function createProduct(req, res) {
  const { name, description, price, images, category, stock, isActive } = req.body;

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
    isActive,
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async function updateProduct(req, res) {
  const { name, description, price, images, category, stock, isActive } = req.body;

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
  if (isActive !== undefined) product.isActive = isActive;

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
