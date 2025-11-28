import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },

    label: String,                     // Home / Work
    fullAddress: { type: String, required:true },
    pincode: String,
    city: String,
    state: String,

    coords: {
        lat: Number,
        lng: Number
    }

}, { timestamps:true });

export default mongoose.model("Address", addressSchema);
