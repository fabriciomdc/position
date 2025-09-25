import dotenv from "dotenv";
dotenv.config();

export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
export const CHANNEL_ID = process.env.CHANNEL_ID!;
export const PORT = process.env.PORT || 3000;
