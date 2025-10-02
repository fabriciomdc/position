import { Request, Response } from "express";
import { fetchLatestVideo } from "../services/youtubeService";
import { formatVideoMessage, formatShortMessage } from "../utils/formatMessages";

export const getLatestVideo = async (req: Request, res: Response) => {
  const customText = req.query.text as string | undefined;
  const { channelId } = req.params;

  try {
    const { id, title } = await fetchLatestVideo("medium", channelId);
    res.send(formatVideoMessage(id, title, customText));
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch latest video");
  }
};

export const getLatestShort = async (req: Request, res: Response) => {
  const customText = req.query.text as string | undefined;
  const { channelId } = req.params;

  try {
    const { id, title } = await fetchLatestVideo("short", channelId);
    res.send(formatShortMessage(id, title));
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch latest Short");
  }
};

