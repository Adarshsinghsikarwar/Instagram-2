import { ImageKit, toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const imagekit = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export const storyUpload = async ({ buffer, fileName }) => {
  try {
    const result = await imagekit.files.upload({
      file: await toFile(buffer, fileName),
      fileName: fileName,
      folder: "/instagram/stories",
    });
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
