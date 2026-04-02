import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error("GOOGLE_CLIENT_ID is not defined in environment variables");
  process.exit(1);
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.error("GOOGLE_CLIENT_SECRET is not defined in environment variables");
  process.exit(1);
}

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  console.error("IMAGEKIT_PUBLIC_KEY is not defined in environment variables");
  process.exit(1);
}
if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  console.error("IMAGEKIT_PRIVATE_KEY is not defined in environment variables");
  process.exit(1);
}
if (!process.env.IMAGEKIT_URL_ENDPOINT) {
  console.error(
    "IMAGEKIT_URL_ENDPOINT is not defined in environment variables"
  );
  process.exit(1);
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};
