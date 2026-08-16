import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async function getCategories(req, res) {
  const includeInactive = req.query.includeInactive === "true" && req.user?.role === "admin";
  const filter = includeInactive ? {} : { isActive: true };

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  // No page param: return the full list (used by the storefront filter sidebar).
  if (!req.query.page) {
    const categories = await Category.find(filter).sort("name");
    return res.json({ categories });
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));

  const [categories, total] = await Promise.all([
    Category.find(filter).sort("name").skip((page - 1) * limit).limit(limit),
    Category.countDocuments(filter),
  ]);

  res.json({
    categories,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
});

export const createCategory = asyncHandler(async function createCategory(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  const existing = await Category.findOne({ name: name.trim().toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "A category with this name already exists" });
  }

  const category = await Category.create({ name });
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async function updateCategory(req, res) {
  const { name, isActive } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (name !== undefined) {
    const existing = await Category.findOne({
      name: name.trim().toLowerCase(),
      _id: { $ne: category._id },
    });
    if (existing) {
      return res.status(409).json({ message: "A category with this name already exists" });
    }
    category.name = name;
  }
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();
  res.json({ category });
});

export const deleteCategory = asyncHandler(async function deleteCategory(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    return res.status(400).json({
      message: `Cannot delete a category with ${productCount} product(s). Deactivate it instead.`,
    });
  }

  await category.deleteOne();
  res.json({ message: "Category deleted" });
});
