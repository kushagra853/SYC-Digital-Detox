import cron from "node-cron";
import User from "../model/User.js";

// Runs every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("Running missed submissions check...");

  try {
    const users = await User.find();

    for (const user of users) {
      // Skip already disqualified users
      if (user.disqualified) continue;

      // If user never submitted anything, skip
      if (!user.lastSubmissionDate) continue;

      // Calculate days since last submission
      const diffDays =
        (Date.now() - new Date(user.lastSubmissionDate)) /
        (1000 * 60 * 60 * 24);

      // If last submission was 2 or more days ago
      if (diffDays >= 2) {
        user.missedSubmissions += 1;

        // Disqualify if missed 2 or more times
        if (user.missedSubmissions >= 2) {
          user.disqualified = true;
          console.log(
            `${user.name} (${user.email}) disqualified for missing submissions ${user.missedSubmissions} times`
          );
        } else {
          console.log(
            `${user.name} missed a submission (${user.missedSubmissions}/2)`
          );
        }

        await user.save();
      }
    }

    console.log("Missed submission check completed");
  } catch (error) {
    console.error("Error running missed submission check:", error);
  }
});
