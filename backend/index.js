import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { ocrService } from "./services/ocrService.js";
import "./jobs/checkMissedSubmissions.js";
import "./jobs/keepServerAlive.js";
import rankingRoutes from "./routes/rankingRoutes.js";

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((err) => console.error("Connection error", err));

(async () => {
  try {
    console.log("Initializing OCR service...");
    await ocrService.initialize();
    console.log("OCR service initialized");
  } catch (error) {
    console.error("Failed to initialize OCR service:", error);
  }
})();

app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rankings", rankingRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
