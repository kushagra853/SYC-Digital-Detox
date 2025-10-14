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
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    admNo: {
      type: String,
      required: [true, "Admission number is required"],
      unique: true,
      trim: true,
    },
    year: {
      type: Number,
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
