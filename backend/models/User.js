import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },

    role: {
        type: String,
        enum: ["USER", "ADMIN", "DELIVERY"],
        default: "USER"
    },

    avatar: String,
    isEmailVerified: { type: Boolean, default: false },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
