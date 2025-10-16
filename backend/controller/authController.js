import User from "../model/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { name, email, admNo, year, whatsappNumber, phoneType, password } =
      req.body;

    // Check for missing fields
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
        message: "All fields are required. Please fill in all the information.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Validate WhatsApp number (should be numeric and reasonable length)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(whatsappNumber.replace(/[\s-]/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid WhatsApp number (10-15 digits).",
      });
    }

    // Check if user with same admission number already exists
    const existingAdmNo = await User.findOne({ admNo });
    if (existingAdmNo) {
      return res.status(409).json({
        success: false,
        message:
          "This admission number is already registered. Please login instead.",
      });
    }

    // Check if user with same email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered. Please use a different email or login.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
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
      message: "Account created successfully! Welcome to Digital Detox.",
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
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      let fieldName = field;

      // Make field names more user-friendly
      if (field === "admNo") fieldName = "admission number";
      if (field === "whatsappNumber") fieldName = "WhatsApp number";

      return res.status(409).json({
        success: false,
        message: `An account with this ${fieldName} already exists. Please use a different ${fieldName} or login.`,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => {
        // Customize validation messages
        if (err.path === "email") {
          return "Please provide a valid email address.";
        }
        if (err.path === "whatsappNumber") {
          return "Please provide a valid WhatsApp number.";
        }
        return err.message;
      });

      return res.status(400).json({
        success: false,
        message: messages.join(" "),
      });
    }

    console.error("Error during user signup:", error);
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating your account. Please try again.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { admNo, password } = req.body;

    // Check for missing fields
    if (!admNo || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both admission number and password.",
      });
    }

    // Trim and convert admission number to lowercase for case-insensitive matching
    const processedAdmNo = admNo.trim().toLowerCase();

    const user = await User.findOne({ admNo: processedAdmNo }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "No account found with this admission number. Please check and try again.",
      });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful! Welcome back.",
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
      message: "Something went wrong while logging in. Please try again.",
    });
  }
};
