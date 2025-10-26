import axios from "axios";
import fs from "fs/promises";
import path from "path";

export async function uploadToImgBB(file, user, submissionDate) {
  try {
    const formattedDate = submissionDate
      .toISOString()
      .replace(/:/g, "-")
      .replace("T", "_")
      .substring(0, 19);

    const fileName = `${user.name.replace(/ /g, "_")}_${
      user.admNo
    }_${formattedDate}${path.extname(file.originalname)}`;

    const imageBuffer = await fs.readFile(file.path);
    const imageBase64 = imageBuffer.toString("base64");

    const data = new URLSearchParams();
    data.append("key", process.env.IMGBB_API_KEY);
    data.append("image", imageBase64);
    data.append("name", fileName);

    const response = await axios.post("https://api.imgbb.com/1/upload", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.success) {
      console.log(`File Uploaded to ImgBB: ${response.data.data.url}`);
      return response.data.data.url;
    } else {
      throw new Error(`ImgBB API Error: ${response.data.error.message}`);
    }
  } catch (error) {
    console.error("Error uploading to ImgBB:", error.message);
    throw error;
  } finally {
    try {
      await fs.unlink(file.path);
      console.log(`Local file deleted: ${file.path}`);
    } catch (unlinkError) {
      console.error(`Failed to delete local file: ${file.path}`, unlinkError);
    }
  }
}
