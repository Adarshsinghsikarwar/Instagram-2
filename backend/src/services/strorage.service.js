import { ImageKit, toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const imageKit = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export const uploadFile = async ({ buffer, fileName }) => {
  try {
    const result = await imageKit.files.upload({
      file: await toFile(buffer, fileName),
      fileName: fileName,
      folder: "instagram-clone",
    });
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
