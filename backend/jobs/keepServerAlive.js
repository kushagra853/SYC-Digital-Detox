import cron from "node-cron";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Ping every 13 minutes (Render free tier idles after ~15min)
cron.schedule("*/13 * * * *", async () => {
  const url = process.env.RENDER_URL;
  if (!url)
    return console.warn("No RENDER_URL defined, skipping keep-alive ping");

  try {
    const response = await fetch(url);
    console.log(`Keep-alive ping sent to ${url} | Status: ${response.status}`);
  } catch (error) {
    console.error("Keep-alive ping failed:", error.message);
  }
});
