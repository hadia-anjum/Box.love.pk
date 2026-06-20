import fs from "fs";
import path from "path";
import dbConnect from "./db";
import Order from "@/models/Order";

const FALLBACK_FILE = path.join(process.cwd(), "orders_db.json");

// Helper to read local JSON file
function readFallbackFile(): any[] {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = fs.readFileSync(FALLBACK_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading fallback JSON file:", err);
  }
  return [];
}

// Helper to write local JSON file
function writeFallbackFile(orders: any[]) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing fallback JSON file:", err);
  }
}

export async function saveOrder(orderData: any) {
  try {
    // 1. Try MongoDB first
    await dbConnect();
    const newOrder = await Order.create({
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      boxType: orderData.boxType,
      inkColor: orderData.inkColor,
      topText: orderData.topText || "",
      insideText: orderData.insideText || "",
      addons: orderData.addons || "None",
      total: orderData.total,
      status: "pending",
    });
    console.log("Order saved to MongoDB successfully!");
    return { success: true, order: newOrder, source: "mongodb" };
  } catch (dbErr: any) {
    console.warn("MongoDB connection failed, falling back to local JSON storage:", dbErr.message);

    // 2. Fallback: Save to local JSON file database
    const orders = readFallbackFile();
    const newOrder = {
      _id: "fallback_" + Math.random().toString(36).substring(2, 11),
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      boxType: orderData.boxType,
      inkColor: orderData.inkColor,
      topText: orderData.topText || "",
      insideText: orderData.insideText || "",
      addons: orderData.addons || "None",
      total: orderData.total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder); // Prepend new order
    writeFallbackFile(orders);

    return { success: true, order: newOrder, source: "json_file" };
  }
}

export async function getOrders() {
  try {
    // 1. Try MongoDB first
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });
    return { success: true, orders, source: "mongodb" };
  } catch (dbErr: any) {
    console.warn("MongoDB connection failed, retrieving from local JSON storage:", dbErr.message);

    // 2. Fallback: Read from local JSON file database
    const orders = readFallbackFile();
    return { success: true, orders, source: "json_file" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    // 1. Try MongoDB first
    await dbConnect();
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (updatedOrder) {
      console.log("Order updated in MongoDB successfully!");
      return { success: true, order: updatedOrder, source: "mongodb" };
    }
  } catch (dbErr: any) {
    console.warn("MongoDB connection failed, updating in local JSON storage:", dbErr.message);
  }

  // 2. Fallback: Update order inside local JSON file database
  const orders = readFallbackFile();
  const index = orders.findIndex((ord) => ord._id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    writeFallbackFile(orders);
    return { success: true, order: orders[index], source: "json_file" };
  }

  return { success: false, error: "Order not found in either MongoDB or local storage." };
}
