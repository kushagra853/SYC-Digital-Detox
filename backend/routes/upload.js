import express from "express";
import multer from "multer";
import { extractScreenTime } from "../ocr/index.js";
import Upload from "../models/Upload.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const { screenTime, totalMinutes } = await extractScreenTime(imagePath);

    // Save to DB (if needed)
    await Upload.create({
      userId: req.body.userId,
      date: new Date(),
      imagePath,
      screenTime,
      totalMinutes,
    });

    // Optional: delete file after processing
    fs.unlinkSync(imagePath);

    res.json({ success: true, screenTime, totalMinutes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "OCR failed" });
  }
});

export default router;
