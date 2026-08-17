import "dotenv/config";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Category } from "./models/Category.js";
import { Order } from "./models/Order.js";
import { getNextSequence } from "./models/Counter.js";
import { users } from "./data/users.js";
import { products } from "./data/products.js";
import { categories } from "./data/categories.js";
import { orders } from "./data/orders.js";

const PAID_STATUSES = ["paid", "shipped", "delivered"];
const DAY_MS = 24 * 60 * 60 * 1000;

async function destroyData() {
  await User.deleteMany();
  await Product.deleteMany();
  await Category.deleteMany();
  await Order.deleteMany();
  await mongoose.connection.collection("counters").deleteMany({});
  console.log("Data destroyed");
}

async function importData() {
  await destroyData();
  const createdUsers = await User.create(users);
  const userIdByEmail = new Map(createdUsers.map((u) => [u.email, u._id]));

  const createdCategories = await Category.insertMany(categories);
  const categoryIdByName = new Map(createdCategories.map((c) => [c.name, c._id]));

  const productsWithCategoryIds = products.map((product) => ({
    ...product,
    category: categoryIdByName.get(product.category),
  }));

  const createdProducts = await Product.insertMany(productsWithCategoryIds);
  const productByName = new Map(createdProducts.map((p) => [p.name, p]));

  for (const orderTemplate of orders) {
    const items = orderTemplate.items.map(({ productName, quantity }) => {
      const product = productByName.get(productName);
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
      };
    });

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const seq = await getNextSequence("orderNumber");
    const orderNumber = `ORD-${String(seq).padStart(6, "0")}`;
    const createdAt = new Date(Date.now() - orderTemplate.daysAgo * DAY_MS);

    await Order.create({
      orderNumber,
      user: userIdByEmail.get(orderTemplate.userEmail),
      items,
      shippingAddress: orderTemplate.shippingAddress,
      totalPrice,
      status: orderTemplate.status,
      paidAt: PAID_STATUSES.includes(orderTemplate.status) ? createdAt : undefined,
      createdAt,
      updatedAt: createdAt,
    });
  }

  console.log(
    `Seeded ${users.length} users, ${categories.length} categories, ${products.length} products, and ${orders.length} orders`
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
