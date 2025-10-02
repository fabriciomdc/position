import axios from "axios";
import { YOUTUBE_API_KEY, CHANNEL_ID } from "../config";
import { getCache, setCache } from "../utils/cache";

const CACHE_TTL = 20 * 60 * 1000;

type VideoData = {
  id: string;
  title: string;
};

export const fetchLatestVideo = async (
  duration: "short" | "medium",
  channelId: string = CHANNEL_ID 
): Promise<VideoData> => {
  const cacheKey = `youtube_${duration}_${channelId}`;
  const cached = getCache<VideoData>(cacheKey);
  if (cached) return cached;

  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=1&type=video&videoDuration=${duration}`;
  const response = await axios.get(url);

  const item = response.data.items[0];
  if (!item) throw new Error("Nenhum vídeo encontrado");

  const rawTitle = item.snippet.title;
  const cleanedTitle = rawTitle.split("|")[0].trim();

  const videoData: VideoData = {
    id: item.id.videoId,
    title: cleanedTitle,
  };

  setCache(cacheKey, videoData, CACHE_TTL);
  return videoData;
};
