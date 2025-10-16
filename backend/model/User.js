import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    admNo: {
      type: String,
      required: [true, "Admission number is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
    },
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Please fill a valid 10-digit WhatsApp number"],
    },
    phoneType: {
      type: String,
      required: [true, "Phone type is required"],
    },
    totalScreenTime: {
      type: Number,
      default: 0,
    },
    consecutiveLimitExceeded: { type: Boolean, default: false },
    limitExceedCount: { type: Number, default: 0 },
    disqualified: { type: Boolean, default: false },
    missedSubmissions: { type: Number, default: 0 },
    lastSubmissionDate: { type: Date, default: null },

    screenTimeSubmissions: [
      {
        uploadId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Upload",
          required: true,
        },
        screenTime: {
          type: String,
          required: true,
        },
        totalMinutes: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
