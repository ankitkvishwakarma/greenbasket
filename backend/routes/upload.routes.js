// backend/routes/upload.routes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Create uploads folder if not exists
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// IMPORTANT: field name must be "images"
router.post("/", upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = req.files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });

    return res.json({ urls });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
