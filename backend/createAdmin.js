import dotenv from "dotenv";
dotenv.config();  // <-- ENV load yahi pe hoga

import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectDB from "./config/db.js";

const createAdmin = async () => {
  await connectDB();

  const hashedPwd = await bcrypt.hash("Admin@123", 10);

  await User.create({
    name: "Super Admin",
    email: "admin@test.com",
    password: hashedPwd,
    role: "ADMIN"
  });

  console.log("🔥 Admin Created Successfully");
  process.exit();
};

createAdmin();
