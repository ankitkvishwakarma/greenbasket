import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },           // optional
    stock: { type: Number, required: true, default: 0 },

    images: [String],                                // array of image URLs

    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
