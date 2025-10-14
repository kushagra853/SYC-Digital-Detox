import Tesseract from "tesseract.js";
import sharp from "sharp";
import fs from "fs/promises";

class OCRService {
  constructor() {
    this.worker = null;
  }

  async initialize() {
    if (!this.worker) {
      this.worker = await Tesseract.createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
    }
  }

  async preprocessImage(imagePath) {
    try {
      const processedBuffer = await sharp(imagePath)
        .greyscale()
        .normalize()
        .sharpen()
        .threshold(140)
        .toBuffer();

      return processedBuffer;
    } catch (error) {
      console.error("Error preprocessing image:", error);
      throw error;
    }
  }

  async extractText(imagePath, preprocess = true) {
    try {
      await this.initialize();

      let imageBuffer;

      if (preprocess) {
        imageBuffer = await this.preprocessImage(imagePath);
      } else {
        imageBuffer = await fs.readFile(imagePath);
      }

      const {
        data: { text },
      } = await this.worker.recognize(imageBuffer);
      return text;
    } catch (error) {
      console.error("Error extracting text:", error);
      throw error;
    }
  }

  parseScreenTime(text) {
    const results = {
      success: false,
      data: {},
      rawText: text,
    };

    // Pattern for "X hrs, Y mins" or "X hours, Y minutes"
    const hrsMinsPattern =
      /(\d+)\s*(?:hrs?|hours?)[,\s]*(\d+)\s*(?:mins?|minutes?)/i;
    const hrsMinsMatch = text.match(hrsMinsPattern);

    if (hrsMinsMatch) {
      const hours = parseInt(hrsMinsMatch[1]);
      const minutes = parseInt(hrsMinsMatch[2]);

      results.success = true;
      results.data.totalTime = {
        hours: hours,
        minutes: minutes,
        formatted: `${hours}h ${minutes}m`,
      };
      results.data.totalMinutes = hours * 60 + minutes;
      results.data.screenTime = `${hours}h ${minutes}m`;
    }

    // Pattern for compact "Xh Ym" format
    const compactPattern = /(\d+)h\s*(\d+)m/gi;
    const compactMatches = [...text.matchAll(compactPattern)];

    if (compactMatches.length > 0 && !results.success) {
      const firstMatch = compactMatches[0];
      const hours = parseInt(firstMatch[1]);
      const minutes = parseInt(firstMatch[2]);

      results.success = true;
      results.data.totalTime = {
        hours: hours,
        minutes: minutes,
        formatted: `${hours}h ${minutes}m`,
      };
      results.data.totalMinutes = hours * 60 + minutes;
      results.data.screenTime = `${hours}h ${minutes}m`;
    }

    // Pattern for "Screen On: Xh Ym"
    const screenOnPattern = /Screen\s*On[:\s]*(\d+)h\s*(\d+)m/i;
    const screenOnMatch = text.match(screenOnPattern);

    if (screenOnMatch) {
      const hours = parseInt(screenOnMatch[1]);
      const minutes = parseInt(screenOnMatch[2]);

      if (!results.success) {
        results.success = true;
        results.data.totalMinutes = hours * 60 + minutes;
        results.data.screenTime = `${hours}h ${minutes}m`;
      }

      results.data.screenOn = {
        hours: hours,
        minutes: minutes,
        formatted: `${hours}h ${minutes}m`,
      };
    }

    // Pattern for "Screen Off: Xh Ym"
    const screenOffPattern = /Screen\s*Off[:\s]*(\d+)h\s*(\d+)m/i;
    const screenOffMatch = text.match(screenOffPattern);

    if (screenOffMatch) {
      results.data.screenOff = {
        hours: parseInt(screenOffMatch[1]),
        minutes: parseInt(screenOffMatch[2]),
        formatted: `${screenOffMatch[1]}h ${screenOffMatch[2]}m`,
      };
    }

    // Pattern for unlocks
    const unlocksPattern = /(\d+)\s*(?:\n|\s)*Unlocks/i;
    const unlocksMatch = text.match(unlocksPattern);

    if (unlocksMatch) {
      results.data.unlocks = parseInt(unlocksMatch[1]);
    }

    // Pattern for notifications
    const notificationsPattern = /(\d+)\s*(?:\n|\s)*Notifications/i;
    const notificationsMatch = text.match(notificationsPattern);

    if (notificationsMatch) {
      results.data.notifications = parseInt(notificationsMatch[1]);
    }

    // Extract app names
    const apps = this.extractAppNames(text);
    if (apps.length > 0) {
      results.data.apps = apps;
    }

    // If no screen time found, set error
    if (!results.success) {
      results.error =
        "Could not extract screen time from image. Please ensure the image shows screen time information clearly.";
    }

    return results;
  }

  extractAppNames(text) {
    const commonApps = [
      "Instagram",
      "YouTube",
      "WhatsApp",
      "Snapchat",
      "Facebook",
      "TikTok",
      "Twitter",
      "Chrome",
      "Clock",
      "IRCTC",
      "Gmail",
      "Messages",
      "Phone",
      "Camera",
      "Gallery",
      "Maps",
      "Netflix",
      "Spotify",
    ];

    const foundApps = [];
    const lowerText = text.toLowerCase();

    commonApps.forEach((app) => {
      if (lowerText.includes(app.toLowerCase())) {
        foundApps.push(app);
      }
    });

    return [...new Set(foundApps)];
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

// Create singleton instance
const ocrService = new OCRService();

// Export the main function
export async function extractScreenTime(imagePath) {
  try {
    console.log("Starting OCR extraction for:", imagePath);

    // Extract text from image
    const text = await ocrService.extractText(imagePath);
    console.log("Extracted text:", text.substring(0, 200));

    // Parse screen time from text
    const results = ocrService.parseScreenTime(text);

    if (results.success) {
      console.log(
        "Successfully extracted screen time:",
        results.data.screenTime
      );
    } else {
      console.log("Failed to extract screen time");
    }

    return results;
  } catch (error) {
    console.error("Error in extractScreenTime:", error);
    return {
      success: false,
      error: "Failed to process image: " + error.message,
      data: {},
    };
  }
}

// Export service instance for cleanup
export { ocrService };

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Cleaning up OCR service...");
  await ocrService.cleanup();
});
