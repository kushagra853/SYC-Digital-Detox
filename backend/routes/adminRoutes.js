import express from "express";
import User from "../model/User.js";
import Upload from "../model/Upload.js";

const router = express.Router();

// GET /api/admin/users - Get all users with their data
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({})
      .populate("screenTimeSubmissions.uploadId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      message: error.message,
    });
  }
});

// GET /api/admin/daily-standings - Get daily standings (users with least screen time today)
router.get("/daily-standings", async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Get all users with their submissions for today
    const users = await User.find({}).populate({
      path: "screenTimeSubmissions.uploadId",
      match: {
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
    });

    // Calculate today's screen time for each user
    const dailyStandings = users
      .map((user) => {
        const todaySubmissions = user.screenTimeSubmissions.filter((sub) => {
          const submissionDate = new Date(sub.date);
          return submissionDate >= startOfDay && submissionDate < endOfDay;
        });

        const totalMinutes = todaySubmissions.reduce(
          (sum, sub) => sum + sub.totalMinutes,
          0
        );
        const totalHours = (totalMinutes / 60).toFixed(2);

        return {
          _id: user._id,
          name: user.name,
          admNo: user.admNo,
          year: user.year,
          totalMinutes: totalMinutes,
          totalHours: parseFloat(totalHours),
          submissionsCount: todaySubmissions.length,
          lastSubmission:
            todaySubmissions.length > 0
              ? todaySubmissions[todaySubmissions.length - 1].date
              : null,
        };
      })
      .filter((user) => user.submissionsCount > 0) // Only include users with submissions today
      .sort((a, b) => a.totalMinutes - b.totalMinutes); // Sort by least screen time

    res.json({
      success: true,
      data: dailyStandings,
    });
  } catch (error) {
    console.error("Error fetching daily standings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch daily standings",
      message: error.message,
    });
  }
});

// GET /api/admin/weekly-standings - Get weekly standings chart data
router.get("/weekly-standings", async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // End of current week

    // Get all users with their submissions for the week
    const users = await User.find({}).populate({
      path: "screenTimeSubmissions.uploadId",
      match: {
        date: {
          $gte: startOfWeek,
          $lt: endOfWeek,
        },
      },
    });

    // Get top 5 users by least total screen time this week
    const weeklyData = users
      .map((user) => {
        const weekSubmissions = user.screenTimeSubmissions.filter((sub) => {
          const submissionDate = new Date(sub.date);
          return submissionDate >= startOfWeek && submissionDate < endOfWeek;
        });

        const totalMinutes = weekSubmissions.reduce(
          (sum, sub) => sum + sub.totalMinutes,
          0
        );

        return {
          _id: user._id,
          name: user.name,
          admNo: user.admNo,
          totalMinutes: totalMinutes,
          submissions: weekSubmissions,
        };
      })
      .filter((user) => user.submissions.length > 0)
      .sort((a, b) => a.totalMinutes - b.totalMinutes)
      .slice(0, 5); // Top 5 users

    // Create chart data for each day of the week
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const chartData = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayData = {
        day: daysOfWeek[i],
        date: dayStart.toISOString().split("T")[0],
      };

      // Calculate screen time for each user on this day
      weeklyData.forEach((user) => {
        const daySubmissions = user.submissions.filter((sub) => {
          const submissionDate = new Date(sub.date);
          return submissionDate >= dayStart && submissionDate <= dayEnd;
        });

        const dayMinutes = daySubmissions.reduce(
          (sum, sub) => sum + sub.totalMinutes,
          0
        );
        const dayHours = (dayMinutes / 60).toFixed(1);

        dayData[user.name] = parseFloat(dayHours);
      });

      chartData.push(dayData);
    }

    res.json({
      success: true,
      data: {
        chartData,
        users: weeklyData.map((user) => ({
          name: user.name,
          admNo: user.admNo,
          totalMinutes: user.totalMinutes,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching weekly standings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch weekly standings",
      message: error.message,
    });
  }
});

// GET /api/admin/overall-standings - Get overall standings (users with least total screen time)
router.get("/overall-standings", async (req, res) => {
  try {
    const users = await User.find({})
      .populate("screenTimeSubmissions.uploadId")
      .sort({ totalScreenTime: 1 }); // Sort by least total screen time

    const overallStandings = users
      .map((user) => {
        const totalHours = (user.totalScreenTime / 60).toFixed(2);
        const submissionsCount = user.screenTimeSubmissions?.length || 0;
        const lastSubmission =
          submissionsCount > 0
            ? user.screenTimeSubmissions[submissionsCount - 1].date
            : null;

        return {
          _id: user._id,
          name: user.name,
          admNo: user.admNo,
          year: user.year,
          totalMinutes: user.totalScreenTime,
          totalHours: parseFloat(totalHours),
          submissionsCount: submissionsCount,
          lastSubmission: lastSubmission,
        };
      })
      .filter((user) => user.submissionsCount > 0); // Only include users with submissions

    res.json({
      success: true,
      data: overallStandings,
    });
  } catch (error) {
    console.error("Error fetching overall standings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch overall standings",
      message: error.message,
    });
  }
});

// GET /api/admin/stats - Get admin dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSubmissions = await Upload.countDocuments();

    const usersWithSubmissions = await User.countDocuments({
      "screenTimeSubmissions.0": { $exists: true },
    });

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const todaySubmissions = await Upload.countDocuments({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSubmissions,
        usersWithSubmissions,
        todaySubmissions,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch admin statistics",
      message: error.message,
    });
  }
});

router.get("/user-status/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "missedSubmissions limitExceedCount consecutiveLimitExceeded disqualified name email"
    );
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching user status:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/reset-user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    user.disqualified = false;
    user.limitExceedCount = 0;
    user.consecutiveLimitExceeded = false;
    user.missedSubmissions = 0;

    await user.save();

    res.json({
      success: true,
      message: `✅ User ${user.name} reinstated successfully.`,
      data: user,
    });
  } catch (err) {
    console.error("Error resetting user:", err);
    res.status(500).json({ success: false, error: "Failed to reset user" });
  }
});

export default router;
