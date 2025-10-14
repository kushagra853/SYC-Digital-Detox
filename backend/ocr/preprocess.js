import Jimp from "jimp";

export const preprocessImage = async (inputPath, outputPath = null) => {
  try {
    const image = await Jimp.read(inputPath);
    await image.greyscale().contrast(1).normalize();

    const savePath = outputPath || inputPath;
    await image.writeAsync(savePath);
    return savePath;
  } catch (err) {
    console.error("Error preprocessing image:", err);
    throw err;
  }
};
