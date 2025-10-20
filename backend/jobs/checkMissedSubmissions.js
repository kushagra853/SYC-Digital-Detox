import cron from "node-cron";
import User from "../model/User.js";

// Runs every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("Cron job triggered: Checking for missed submissions...");

  // SAFEGUARD: Define the event start date
  // The first check will run on the morning of the 25th for the 24th's submission.
  const eventStartDate = new Date("2025-10-24T00:00:00.000+05:30");
  const now = new Date();

  // If the current date is before the first day of the event, do nothing.
  if (now < eventStartDate) {
    console.log(
      `Event has not started yet (starts on ${eventStartDate.toLocaleDateString()}). Skipping check.`
    );
    return;
  }

  try {
    // Get the start of "yesterday".
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Find all users who are not already disqualified.
    const users = await User.find({ disqualified: false });

    for (const user of users) {
      let missedYesterday = false;

      // Logic branch 1: User has never submitted (`lastSubmissionDate` is null).
      // After the event start date, this is now considered a missed submission.
      if (!user.lastSubmissionDate) {
        missedYesterday = true;
      } else {
        // Logic branch 2: User has a submission. Check if it's from before yesterday.
        const lastSubDate = new Date(user.lastSubmissionDate);
        lastSubDate.setHours(0, 0, 0, 0);

        // If the user's last submission was before yesterday, they missed yesterday's window.
        if (lastSubDate.getTime() < yesterday.getTime()) {
          missedYesterday = true;
        }
      }

      // If either condition was met, apply the penalty.
      if (missedYesterday) {
        user.missedSubmissions += 1;

        if (user.missedSubmissions >= 2) {
          user.disqualified = true;
          console.log(
            `[DISQUALIFIED] ${user.name} (${user.email}) - Missed count: ${user.missedSubmissions}`
          );
        } else {
          console.log(
            `[MISSED] ${user.name} (${user.email}) - Missed count: ${user.missedSubmissions}`
          );
        }

        await user.save();
      }
    }

    console.log("Missed submission check completed successfully.");
  } catch (error) {
    console.error("Error running missed submission check:", error);
  }
});
