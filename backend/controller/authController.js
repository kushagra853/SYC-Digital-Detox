import User from "../model/User.js";

export const signup = async (req, res) => {
  try {
    const { name, email, admNo, year } = req.body;

    if (!name || !email || !admNo || !year) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const newUser = new User({
      name,
      email,
      admNo,
      year,
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
