import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  boxType: string;
  inkColor: string;
  topText: string;
  insideText: string;
  addons: string;
  total: string;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    boxType: { type: String, required: true },
    inkColor: { type: String, required: true },
    topText: { type: String, default: "" },
    insideText: { type: String, default: "" },
    addons: { type: String, default: "None" },
    total: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: true } }
);

// Prevent compiling model multiple times during Next.js hot reload
const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
