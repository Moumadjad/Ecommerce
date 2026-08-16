import "dotenv/config";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Category } from "./models/Category.js";
import { users } from "./data/users.js";
import { products } from "./data/products.js";
import { categories } from "./data/categories.js";

async function destroyData() {
  await User.deleteMany();
  await Product.deleteMany();
  await Category.deleteMany();
  console.log("Data destroyed");
}

async function importData() {
  await destroyData();
  await User.create(users);

  const createdCategories = await Category.insertMany(categories);
  const categoryIdByName = new Map(createdCategories.map((c) => [c.name, c._id]));

  const productsWithCategoryIds = products.map((product) => ({
    ...product,
    category: categoryIdByName.get(product.category),
  }));

  await Product.insertMany(productsWithCategoryIds);
  console.log(
    `Seeded ${users.length} users, ${categories.length} categories, and ${products.length} products`
  );
}

async function run() {
  await connectDB();

  if (process.argv.includes("-d") || process.argv.includes("--destroy")) {
    await destroyData();
  } else {
    await importData();
  }

  await mongoose.connection.close();
}

run().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
