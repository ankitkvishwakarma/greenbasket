import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // per item price at time of order
    },
  ],

  totalAmount: { type: Number, required: true },

  status: {
    type: String,
    enum: [
      "PENDING",
      "CONFIRMED",
      "PACKED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ],
    default: "PENDING",
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },

  deliveryBoyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryBoy",
  },

  timeline: [
    {
      status: String,
      time: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
