import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
  user: { type: Object, required: true },
  paid: { type: Array, required: true },
  free: { type: Array, required: true },
  quantity: { type: Number, required: true },
  price: { type: String, required: true },
  address: { type: String, required: true },
  stripeSessionId: { type: String },
  amount: { type: Number },
  currency: { type: String },
  status: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },
});

const OrderModel = models.Order || model("Order", OrderSchema);
export default OrderModel;
