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

// POST /api/uploads/extract - Extract screen time and apply rules
router.post("/extract", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided",
      });
    }

    // event start date check - October 24, 2025, 9:59 PM
    const eventStartDate = new Date("2025-10-24T16:00:00.000Z");
    const now = new Date();

    if (now < eventStartDate) {
      if (req.file?.path) {
        await fs.unlink(req.file.path);
      }
      return res.status(403).json({
        success: false,
        error:
          "Event has not started yet. The uploading begins on October 24, 2025 at 9:59 PM ",
        eventStartsAt: eventStartDate.toISOString(),
      });
    }

    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      await fs.unlink(req.file.path);
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Disqualified users cannot submit
    if (user.disqualified) {
      await fs.unlink(req.file.path);
      return res.status(403).json({
        success: false,
        error: "You are disqualified and cannot submit further screenshots.",
      });
    }

    // Submission window (10:00 PM – 11:59 PM )
    const istOffset = 5.5 * 60 * 60 * 1000; // offset in milliseconds
    const istTime = new Date(now.getTime() + istOffset);
    const hour = istTime.getUTCHours();
    const minute = istTime.getUTCMinutes();

    if (hour < 22 || hour > 23 || (hour === 23 && minute > 59)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "Submissions are only allowed between 10:00 PM and 11:59 PM IST",
      });
    }

    // Check if user already submitted today
    const todayIST = new Date(istTime);
    todayIST.setUTCHours(0, 0, 0, 0);
    const tomorrowIST = new Date(todayIST);
    tomorrowIST.setUTCDate(tomorrowIST.getUTCDate() + 1);

    const todaySubmission = user.screenTimeSubmissions.find((sub) => {
      const subDate = new Date(sub.date);
      const subDateIST = new Date(subDate.getTime() + istOffset);
      const subDayStart = new Date(subDateIST);
      subDayStart.setUTCHours(0, 0, 0, 0);
      return subDayStart.getTime() === todayIST.getTime();
    });

    if (todaySubmission) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "You have already submitted your screen time for today.",
      });
    }

    // Extract screen time via OCR
    const extractedData = await extractScreenTime(req.file.path);
    if (!extractedData.success) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error:
          extractedData.error || "Failed to extract screen time from image",
      });
    }

    const totalMinutes = extractedData.data.totalMinutes;
    const limitExceeded = totalMinutes > 210; //3 hours 30 mins

    // saving any upload first (before any disqualification logic)
    const newUpload = new Upload({
      userId: user._id,
      imagePath: req.file.filename,
      screenTime: extractedData.data.screenTime,
      totalMinutes,
      date: now,
    });

    await newUpload.save();

    // update user with submission data
    user.screenTimeSubmissions.push({
      uploadId: newUpload._id,
      screenTime: extractedData.data.screenTime,
      totalMinutes,
      date: now,
    });
    user.totalScreenTime += totalMinutes;
    user.lastSubmissionDate = now;

    // handle limit exceed / disqualification logic
    if (limitExceeded) {
      user.limitExceedCount += 1;

      // Check for consecutive exceeds
      // Get the last submission before today
      const sortedSubmissions = [...user.screenTimeSubmissions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Check if previous submission (if exists) also exceeded
      if (sortedSubmissions.length >= 2) {
        const previousSubmission = sortedSubmissions[1]; // Index 0 is today's submission
        const previousExceeded = previousSubmission.totalMinutes > 210;

        if (previousExceeded) {
          // Two consecutive days exceeded - disqualify
          user.consecutiveLimitExceeded = true;
          user.disqualified = true;
        } else {
          // Not consecutive, reset the flag
          user.consecutiveLimitExceeded = false;
        }
      } else {
        // First submission that exceeded - NOT consecutive yet
        user.consecutiveLimitExceeded = false;
      }

      // Check for total 3 exceeds
      if (user.limitExceedCount >= 3) {
        user.disqualified = true;
      }
    } else {
      // Within limit - reset consecutive flag
      user.consecutiveLimitExceeded = false;
    }

    await user.save();

    // Prepare response
    const response = {
      success: true,
      data: {
        id: newUpload._id,
        screenTime: extractedData.data.screenTime,
        totalMinutes,
        date: now,
      },
    };

    // Add disqualification message if applicable
    if (user.disqualified) {
      response.warning =
        "You have been disqualified for exceeding the daily limit twice consecutively or 3 times in total.";
      response.disqualified = true;
    } else if (limitExceeded) {
      response.warning = `You have exceeded the 3 hour 30 mins daily limit. Exceed count: ${user.limitExceedCount}/3`;
    }

    res.json(response);
  } catch (error) {
    console.error("Error processing upload:", error);
    if (req.file?.path) {
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

//  GET /api/uploads - Get all uploads for a user
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

// GET /api/uploads/submissions/:userId - Get user's submissions
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
    console.error("Error fetching total screen time:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch total screen time",
      message: error.message,
    });
  }
});

export default router;
