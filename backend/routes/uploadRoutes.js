import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { extractScreenTime } from "../services/ocrService.js";
import Upload from "../model/Upload.js";
import User from "../model/User.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "./uploads";
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "screenshot-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, JPG, PNG, WEBP) are allowed!"));
    }
  },
});

// POST /api/uploads/extract - Extract screen time from image
router.post("/extract", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided",
      });
    }

    const imagePath = req.file.path;

    // Extract screen time data using OCR
    const extractedData = await extractScreenTime(imagePath);

    // Check if extraction was successful
    if (!extractedData.success) {
      // Clean up uploaded file
      await fs.unlink(imagePath);
      return res.status(400).json({
        success: false,
        error:
          extractedData.error || "Failed to extract screen time from image",
      });
    }

    // Save to database
    const userId = req.body.userId || null;
    const uploadDate = req.body.date || new Date();

    const newUpload = new Upload({
      userId: userId,
      imagePath: req.file.filename,
      screenTime: extractedData.data.screenTime,
      totalMinutes: extractedData.data.totalMinutes,
      date: uploadDate,
    });

    await newUpload.save();

    // Update user document with screen time submission
    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            screenTimeSubmissions: {
              uploadId: newUpload._id,
              screenTime: extractedData.data.screenTime,
              totalMinutes: extractedData.data.totalMinutes,
              date: newUpload.date,
            },
          },
          $inc: { totalScreenTime: extractedData.data.totalMinutes },
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      data: {
        id: newUpload._id,
        screenTime: extractedData.data.screenTime,
        totalMinutes: extractedData.data.totalMinutes,
        date: newUpload.date,
        extractedData: extractedData.data,
      },
    });
  } catch (error) {
    console.error("Error processing upload:", error);

    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: "Failed to process image",
      message: error.message,
    });
  }
});

// GET /api/uploads - Get all uploads for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      query.userId = userId;
    }

    const uploads = await Upload.find(query).sort({ date: -1 }).limit(50);

    res.json({
      success: true,
      data: uploads,
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch uploads",
      message: error.message,
    });
  }
});

// GET /api/uploads/:id - Get a specific upload
router.get("/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({
        success: false,
        error: "Upload not found",
      });
    }

    res.json({
      success: true,
      data: upload,
    });
  } catch (error) {
    console.error("Error fetching upload:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch upload",
      message: error.message,
    });
  }
});

// DELETE /api/uploads/:id - Delete an upload
router.delete("/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({
        success: false,
        error: "Upload not found",
      });
    }

    // Delete image file
    const imagePath = path.join("./uploads", upload.imagePath);
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      console.error("Error deleting image file:", error);
    }

    // Delete from database
    await Upload.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Upload deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting upload:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete upload",
      message: error.message,
    });
  }
});

// GET /api/uploads/stats/:userId - Get user statistics
router.get("/stats/:userId", async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.params.userId });

    if (uploads.length === 0) {
      return res.json({
        success: true,
        data: {
          totalUploads: 0,
          averageScreenTime: 0,
          totalMinutes: 0,
          highestScreenTime: 0,
          lowestScreenTime: 0,
        },
      });
    }

    const totalMinutes = uploads.reduce((sum, u) => sum + u.totalMinutes, 0);
    const screenTimes = uploads.map((u) => u.totalMinutes);

    res.json({
      success: true,
      data: {
        totalUploads: uploads.length,
        averageScreenTime: (totalMinutes / uploads.length / 60).toFixed(1),
        totalMinutes: totalMinutes,
        highestScreenTime: (Math.max(...screenTimes) / 60).toFixed(1),
        lowestScreenTime: (Math.min(...screenTimes) / 60).toFixed(1),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
      message: error.message,
    });
  }
});

// GET /api/uploads/submissions/:userId - Get user screen time submissions
router.get("/submissions/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "screenTimeSubmissions.uploadId"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.screenTimeSubmissions || [],
    });
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user submissions",
      message: error.message,
    });
  }
});

// GET /api/uploads/total-screen-time/:userId - Get user's total screen time
router.get("/total-screen-time/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        totalScreenTimeMinutes: user.totalScreenTime,
        totalScreenTimeHours: (user.totalScreenTime / 60).toFixed(2),
        totalSubmissions: user.screenTimeSubmissions?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user total screen time:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user total screen time",
      message: error.message,
    });
  }
});

export default router;
