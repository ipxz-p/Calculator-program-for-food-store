import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL!;

const MenuItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    hasDoubleOrderDiscount: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MenuItem =
  mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);

const menuItems = [
  {
    slug: "red",
    name: "Red Set",
    price: 50,
    description: "Red hot spicy set",
    hasDoubleOrderDiscount: false,
  },
  {
    slug: "green",
    name: "Green Set",
    price: 40,
    description: "Green healthy set — Order doubles for 5% off!",
    hasDoubleOrderDiscount: true,
  },
  {
    slug: "blue",
    name: "Blue Set",
    price: 30,
    description: "Blue cool set",
    hasDoubleOrderDiscount: false,
  },
  {
    slug: "yellow",
    name: "Yellow Set",
    price: 50,
    description: "Yellow sweet set",
    hasDoubleOrderDiscount: false,
  },
  {
    slug: "pink",
    name: "Pink Set",
    price: 80,
    description: "Pink sweet set — Order doubles for 5% off!",
    hasDoubleOrderDiscount: true,
  },
  {
    slug: "purple",
    name: "Purple Set",
    price: 90,
    description: "Purple sweet set",
    hasDoubleOrderDiscount: false,
  },
  {
    slug: "orange",
    name: "Orange Set",
    price: 120,
    description: "Orange sweet set — Order doubles for 5% off!",
    hasDoubleOrderDiscount: true,
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  console.log("Seeding menu items...");

  for (const item of menuItems) {
    await MenuItem.findOneAndUpdate({ slug: item.slug }, item, {
      upsert: true,
      returnDocument: "after",
    });
  }

  const count = await MenuItem.countDocuments();
  console.log(`Seeded ${count} menu items.`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
