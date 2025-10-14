import Tesseract from "tesseract.js";
import { preprocessImage } from "./preprocess.js";

export const extractScreenTime = async (imagePath) => {
  try {
    // Preprocess image (improves OCR quality)
    await preprocessImage(imagePath);

    // Run OCR
    const result = await Tesseract.recognize(imagePath, "eng", {
      tessedit_char_whitelist: "0123456789hmrisn ",
    });

    const text = result.data.text.toLowerCase();
    console.log("OCR Text:", text);

    // Extract screen time with regex
    const match = text.match(/(\d+)\s*h(?:r|rs)?\s*(\d+)?\s*m?/);
    let hours = 0,
      minutes = 0;

    if (match) {
      hours = parseInt(match[1]) || 0;
      minutes = parseInt(match[2]) || 0;
    } else {
      // fallback: only minutes
      const minOnly = text.match(/(\d+)\s*m(?:in|ins)?/);
      if (minOnly) minutes = parseInt(minOnly[1]);
    }

    const totalMinutes = hours * 60 + minutes;
    const formattedTime = `${hours}h ${minutes}m`;

    return { screenTime: formattedTime, totalMinutes };
  } catch (err) {
    console.error("OCR Extraction Failed:", err);
    throw new Error("Failed to extract screen time");
  }
};
