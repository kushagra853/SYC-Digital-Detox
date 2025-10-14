import User from "../model/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { name, email, admNo, year, whatsappNumber, phoneType, password } =
      req.body;

    if (
      !name ||
      !email ||
      !admNo ||
      !year ||
      !whatsappNumber ||
      !phoneType ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      admNo,
      year,
      whatsappNumber,
      phoneType,
      password: hashedPassword,
      totalScreenTime: 0,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        admNo: savedUser.admNo,
        year: savedUser.year,
        whatsappNumber: savedUser.whatsappNumber,
        phoneType: savedUser.phoneType,
        totalScreenTime: savedUser.totalScreenTime,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(" "),
      });
    }

    console.error("Error during user signup:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { admNo, password } = req.body;

    if (!admNo || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide admission number and password.",
      });
    }

    const user = await User.findOne({ admNo }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect admission number or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        admNo: user.admNo,
        year: user.year,
        whatsappNumber: user.whatsappNumber,
        phoneType: user.phoneType,
        totalScreenTime: user.totalScreenTime,
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};