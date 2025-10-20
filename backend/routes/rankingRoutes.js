import User from "../model/User.js";
import express from "express";

const router = express.Router();

export const getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    const allUsers = await User.find({ disqualified: false })
      .sort({ totalScreenTime: 1 })
      .select("_id");

    const rank =
      allUsers.findIndex((user) => user._id.toString() === userId) + 1;

    if (rank === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found in rankings or is disqualified.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        rank,
        totalParticipants: allUsers.length,
      },
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user rank.",
      error: error.message,
    });
  }
};
router.get("/:userId", getUserRank);
export default router;
