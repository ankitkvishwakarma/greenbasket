import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    vehicleNumber: String,
    activeStatus: { type: Boolean, default: true },

    lastKnownLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

deliveryBoySchema.index({ lastKnownLocation: "2dsphere" });

export default mongoose.model("DeliveryBoy", deliveryBoySchema);
