// models/Order.ts
import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    user: { type: Object, required: true },
    paid: { type: Array, required: true },
    free: { type: Array, required: true },
    quantity: { type: Number, required: true },
    price: { type: String, required: true },
    address: { type: String, required: true },
    stripeSessionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const OrderModel = models.Order || model("Order", OrderSchema);
export default OrderModel;
