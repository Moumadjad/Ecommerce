import "dotenv/config";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { users } from "./data/users.js";
import { products } from "./data/products.js";

async function destroyData() {
  await User.deleteMany();
  await Product.deleteMany();
  console.log("Data destroyed");
}

async function importData() {
  await destroyData();
  await User.create(users);
  await Product.insertMany(products);
  console.log(`Seeded ${users.length} users and ${products.length} products`);
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
