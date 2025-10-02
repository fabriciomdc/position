import axios from "axios";
import { YOUTUBE_API_KEY, CHANNEL_ID } from "../config";
import { getCache, setCache } from "../utils/cache";

const CACHE_TTL = 20 * 60 * 1000;

export const fetchLatestVideo = async (
  duration: "short" | "medium",
  channelId: string = CHANNEL_ID 
) => {
  const cacheKey = `youtube_${duration}_${channelId}`;
  const cached = getCache<string>(cacheKey);
  if (cached) return cached;

  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=1&type=video&videoDuration=${duration}`;
  const response = await axios.get(url);
  const videoId = response.data.items[0]?.id?.videoId;

  if (!videoId) {
    throw new Error("Nenhum vídeo encontrado");
  }

  setCache(cacheKey, videoId, CACHE_TTL);
  return videoId;
};
