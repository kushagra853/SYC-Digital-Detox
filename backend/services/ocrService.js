// import Tesseract from "tesseract.js";
// import sharp from "sharp";
// import fs from "fs/promises";

// class OCRService {
//   constructor() {
//     this.worker = null;
//   }

//   async initialize() {
//     if (!this.worker) {
//       this.worker = await Tesseract.createWorker("eng", 1, {
//         logger: (m) => {
//           if (m.status === "recognizing text") {
//             console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
//           }
//         },
//       });
//     }
//   }

//   async preprocessImage(imagePath) {
//     try {
//       const processedBuffer = await sharp(imagePath)
//         .greyscale()
//         .normalize()
//         .sharpen()
//         .threshold(140)
//         .toBuffer();

//       return processedBuffer;
//     } catch (error) {
//       console.error("Error preprocessing image:", error);
//       throw error;
//     }
//   }

//   async extractText(imagePath, preprocess = true) {
//     try {
//       await this.initialize();

//       let imageBuffer;

//       if (preprocess) {
//         imageBuffer = await this.preprocessImage(imagePath);
//       } else {
//         imageBuffer = await fs.readFile(imagePath);
//       }

//       const {
//         data: { text },
//       } = await this.worker.recognize(imageBuffer);
//       return text;
//     } catch (error) {
//       console.error("Error extracting text:", error);
//       throw error;
//     }
//   }

//   parseScreenTime(text) {
//     const results = {
//       success: false,
//       data: {},
//       rawText: text,
//     };

//     // Pattern for "X hrs, Y mins" or "X hours, Y minutes"
//     const hrsMinsPattern =
//       /(\d+)\s*(?:hrs?|hours?)[,\s]*(\d+)\s*(?:mins?|minutes?)/i;
//     const hrsMinsMatch = text.match(hrsMinsPattern);

//     if (hrsMinsMatch) {
//       const hours = parseInt(hrsMinsMatch[1]);
//       const minutes = parseInt(hrsMinsMatch[2]);

//       results.success = true;
//       results.data.totalTime = {
//         hours: hours,
//         minutes: minutes,
//         formatted: `${hours}h ${minutes}m`,
//       };
//       results.data.totalMinutes = hours * 60 + minutes;
//       results.data.screenTime = `${hours}h ${minutes}m`;
//     }

//     // Pattern for compact "Xh Ym" format
//     const compactPattern = /(\d+)h\s*(\d+)m/gi;
//     const compactMatches = [...text.matchAll(compactPattern)];

//     if (compactMatches.length > 0 && !results.success) {
//       const firstMatch = compactMatches[0];
//       const hours = parseInt(firstMatch[1]);
//       const minutes = parseInt(firstMatch[2]);

//       results.success = true;
//       results.data.totalTime = {
//         hours: hours,
//         minutes: minutes,
//         formatted: `${hours}h ${minutes}m`,
//       };
//       results.data.totalMinutes = hours * 60 + minutes;
//       results.data.screenTime = `${hours}h ${minutes}m`;
//     }

//     // Pattern for "Screen On: Xh Ym"
//     const screenOnPattern = /Screen\s*On[:\s]*(\d+)h\s*(\d+)m/i;
//     const screenOnMatch = text.match(screenOnPattern);

//     if (screenOnMatch) {
//       const hours = parseInt(screenOnMatch[1]);
//       const minutes = parseInt(screenOnMatch[2]);

//       if (!results.success) {
//         results.success = true;
//         results.data.totalMinutes = hours * 60 + minutes;
//         results.data.screenTime = `${hours}h ${minutes}m`;
//       }

//       results.data.screenOn = {
//         hours: hours,
//         minutes: minutes,
//         formatted: `${hours}h ${minutes}m`,
//       };
//     }

//     // Pattern for "Screen Off: Xh Ym"
//     const screenOffPattern = /Screen\s*Off[:\s]*(\d+)h\s*(\d+)m/i;
//     const screenOffMatch = text.match(screenOffPattern);

//     if (screenOffMatch) {
//       results.data.screenOff = {
//         hours: parseInt(screenOffMatch[1]),
//         minutes: parseInt(screenOffMatch[2]),
//         formatted: `${screenOffMatch[1]}h ${screenOffMatch[2]}m`,
//       };
//     }

//     // If no screen time found, set error
//     if (!results.success) {
//       results.error =
//         "Could not extract screen time from image. Please ensure the image shows screen time information clearly.";
//     }

//     return results;
//   }

//   async cleanup() {
//     if (this.worker) {
//       await this.worker.terminate();
//       this.worker = null;
//     }
//   }
// }

// // Create singleton instance
// const ocrService = new OCRService();

// // Export the main function
// export async function extractScreenTime(imagePath) {
//   try {
//     console.log("Starting OCR extraction for:", imagePath);

//     // Extract text from image
//     const text = await ocrService.extractText(imagePath);
//     console.log("Extracted text:", text.substring(0, 200));

//     // Parse screen time from text
//     const results = ocrService.parseScreenTime(text);

//     if (results.success) {
//       console.log(
//         "Successfully extracted screen time:",
//         results.data.screenTime
//       );
//     } else {
//       console.log("Failed to extract screen time");
//     }

//     return results;
//   } catch (error) {
//     console.error("Error in extractScreenTime:", error);
//     return {
//       success: false,
//       error: "Failed to process image: " + error.message,
//       data: {},
//     };
//   }
// }

// // Export service instance for cleanup
// export { ocrService };

// // shutdown
// process.on("SIGTERM", async () => {
//   console.log("Cleaning up OCR service...");
//   await ocrService.cleanup();
// });

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
        .threshold(140) // Adjusted threshold for better clarity
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

  /**
   * Parses screen time from OCR text using a prioritized list of regex patterns.
   * @param {string} text - The raw text extracted from the image.
   * @returns {object} - The parsing result.
   */
  parseScreenTime(text) {
    const results = {
      success: false,
      data: {},
      rawText: text,
    };

    // Helper to set success data
    const setSuccessData = (hours, minutes) => {
      if (results.success) return; // Don't overwrite a successful match
      results.success = true;
      const formatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      results.data.totalTime = {
        hours: hours,
        minutes: minutes,
        formatted: formatted,
      };
      results.data.totalMinutes = hours * 60 + minutes;
      results.data.screenTime = formatted;
    };

    // Define patterns in order of priority (most specific to least specific)
    // type 'hm': match[1] = hours, match[2] = minutes
    // type 'm':  match[1] = minutes
    // type 'h':  match[1] = hours
    const patterns = [
      // --- High Priority (Specific keywords + full time) ---
      {
        regex:
          /(Screen On|Total|Usage|TODAY)\s*[:\s]*(\d+)\s*(?:hrs?|hours?)[,\s]+(\d+)\s*(?:mins?|minutes?)/i,
        type: "hm",
        groups: { h: 2, m: 3 },
      },
      {
        regex: /(Screen On|Total|Usage|TODAY)\s*[:\s]*(\d+)h\s*(\d+)m/i,
        type: "hm",
        groups: { h: 2, m: 3 },
      },
      {
        regex: /(Screen On|Total|Usage|TODAY)\s*[:\s]*(\d{1,2}):(\d{2})/i,
        type: "hm",
        groups: { h: 2, m: 3 },
      },

      // --- Medium Priority (Context-less full time or keyword + partial time) ---
      {
        regex: /\b(\d+)\s*(?:hrs?|hours?)[,\s]+(\d+)\s*(?:mins?|minutes?)/i,
        type: "hm",
        groups: { h: 1, m: 2 },
      },
      {
        regex: /\b(\d+)h\s*(\d+)m\b/i,
        type: "hm",
        groups: { h: 1, m: 2 },
      },
      {
        // Specific case from image: "TODAY 47 minutes"
        regex: /TODAY\s*(\d+)\s*(mins?|minutes?)/i,
        type: "m",
        groups: { m: 1 },
      },
      {
        regex: /(Screen On|Total|Usage)\s*[:\s]*(\d+)\s*(mins?|minutes?|m)\b/i,
        type: "m",
        groups: { m: 2 },
      },
      {
        regex:
          /(Screen On|Total|Usage|TODAY)\s*[:\s]*(\d+)\s*(hrs?|hours?|h)\b/i,
        type: "h",
        groups: { h: 2 },
      },

      // --- Low Priority (Fallbacks, context-less partial time) ---
      {
        // Matches "2 hours" or "1 hr" but NOT "2 hours, 30 minutes" (using negative lookahead)
        regex: /\b(\d+)\s*(?:hrs?|hours?)\b(?![\s,]*\d+\s*(?:mins?|minutes?))/i,
        type: "h",
        groups: { h: 1 },
      },
      {
        // Matches "47 minutes" or "30 min" but NOT "2 hours, 30 minutes" (using negative lookbehind)
        // Note: JS only recently got lookbehind, but Tesseract text is unlikely to be so precise.
        // A simpler regex is safer and will be caught *after* the 'hm' patterns.
        regex: /\b(\d+)\s*(mins?|minutes?)\b/i,
        type: "m",
        groups: { m: 1 },
      },
      {
        // Matches "30m" but NOT "2h 30m"
        regex: /\b(\d+)m\b(?![\w])/i,
        type: "m",
        groups: { m: 1 },
      },
    ];

    // Loop through patterns and stop at the first match
    for (const pattern of patterns) {
      const match = text.match(pattern.regex);

      if (match) {
        let hours = 0;
        let minutes = 0;

        try {
          if (pattern.type === "hm") {
            hours = parseInt(match[pattern.groups.h] || 0);
            minutes = parseInt(match[pattern.groups.m] || 0);
          } else if (pattern.type === "m") {
            minutes = parseInt(match[pattern.groups.m] || 0);
          } else if (pattern.type === "h") {
            hours = parseInt(match[pattern.groups.h] || 0);
          }

          setSuccessData(hours, minutes);
          break; // Found a match, stop searching
        } catch (e) {
          console.error("Error parsing regex match:", e, match);
        }
      }
    }

    // --- Special check for "Screen Off" (don't set as main time) ---
    // This runs separately because we don't want "Screen Off" to be the *primary* extracted time
    const screenOffPattern =
      /Screen\s*Off[:\s]*(?:(\d+)h\s*|(\d+)\s*(?:hrs?|hours?)\s*)?(\d+)(?:m|mins?|minutes?)\b/i;
    const screenOffMatch = text.match(screenOffPattern);

    if (screenOffMatch) {
      const hours = parseInt(screenOffMatch[1] || screenOffMatch[2] || 0);
      const minutes = parseInt(screenOffMatch[3] || 0);
      results.data.screenOff = {
        hours: hours,
        minutes: minutes,
        formatted: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      };
    }

    // If no screen time found after all patterns, set error
    if (!results.success) {
      results.error =
        "Could not extract screen time from image. Please ensure the image shows screen time information clearly.";
    }

    return results;
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
    console.log("Extracted text:", text.substring(0, 300)); // Log more text

    // Parse screen time from text
    const results = ocrService.parseScreenTime(text);

    if (results.success) {
      console.log(
        "Successfully extracted screen time:",
        results.data.screenTime
      );
    } else {
      console.log("Failed to extract screen time:", results.error);
    }

    // Log screen off time if found
    if (results.data.screenOff) {
      console.log("Found Screen Off time:", results.data.screenOff.formatted);
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

// shutdown
process.on("SIGTERM", async () => {
  console.log("Cleaning up OCR service...");
  await ocrService.cleanup();
});
