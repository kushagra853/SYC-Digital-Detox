import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((err) => console.error("Connection error", err));

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
