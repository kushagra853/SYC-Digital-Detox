import User from "../model/User.js";
import express from "express";

const router = express.Router();

export const getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    const allUsers = await User.find({
      disqualified: false,
      totalScreenTime: { $gt: 0 },
    })
      .sort({ totalScreenTime: 1 })
      .select("_id name totalScreenTime");
    const rank =
      allUsers.findIndex((user) => user._id.toString() === userId) + 1;

    if (rank === 0) {
      const user = await User.findById(userId);
      let message = "User not found in rankings.";

      if (user?.disqualified) {
        message = "You are disqualified from the rankings.";
      } else if (!user?.totalScreenTime || user?.totalScreenTime === 0) {
        message = "You are not yet ranked. Submit your first screen time.";
      }

      return res.status(404).json({
        success: false,
        message: message,
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
