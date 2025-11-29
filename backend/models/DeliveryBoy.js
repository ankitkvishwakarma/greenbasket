import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },

    name: { type:String, required:true },
    phone: { type:String, required:true },
    email: { type:String, required:true },
    vehicleNumber: { type:String, required:true },

    // ❗ password required nahi hoga yaha
    password: { type:String },

    status:{ type:String, enum:["ACTIVE","OFFLINE"], default:"ACTIVE" },

    lastKnownLocation:{
        type:{ type:String, enum:["Point"], default:"Point" },
        coordinates:{ type:[Number], default:[0,0] }
    }
},{timestamps:true});

deliveryBoySchema.index({ lastKnownLocation:"2dsphere" });

export default mongoose.model("DeliveryBoy", deliveryBoySchema);
