import { Request, Response } from "express";
import { fetchLatestVideo } from "../services/youtubeService";
import { formatVideoMessage, formatShortMessage } from "../utils/formatMessages";


export const getLatestVideo = async (req: Request, res: Response) => {
  const customText = req.query.text as string | undefined;
  try {
    const videoId = await fetchLatestVideo("medium");
    res.send(formatVideoMessage(videoId, customText));
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch latest video");
  }
};

export const getLatestShort = async (req: Request, res: Response) => {
  const customText = req.query.text as string | undefined;
  try {
    const videoId = await fetchLatestVideo("short");
    res.send(formatShortMessage(videoId, customText));
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch latest Short");
  }
};
