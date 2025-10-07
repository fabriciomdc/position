import axios from "axios";
import { YOUTUBE_API_KEY, CHANNEL_ID } from "../config";
import { getCache, setCache } from "../utils/cache";

const CACHE_TTL = 20 * 60 * 1000;

type VideoData = {
  id: string;
  title: string;
  duration: number;
};

export const fetchLatestVideo = async (
  duration: "short" | "medium",
  channelId: string = CHANNEL_ID
): Promise<VideoData> => {
  const cacheKey = `youtube_${duration}_${channelId}`;
  const cached = getCache<VideoData>(cacheKey);
  if (cached) return cached;

  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=5&type=video`;
  const response = await axios.get(url);
  const items = response.data.items;

  if (!items || items.length === 0) throw new Error("Nenhum vídeo encontrado");

  const ids = items.map((item: any) => item.id.videoId).join(",");
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${ids}&part=contentDetails,snippet`;
  const detailsResponse = await axios.get(detailsUrl);

  const videos: VideoData[] = detailsResponse.data.items.map((video: any) => {
    const rawTitle = video.snippet.title;
    const cleanedTitle = rawTitle.split("|")[0].trim();
    const durationISO = video.contentDetails.duration;

    const match = durationISO.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match?.[1] || "0");
    const minutes = parseInt(match?.[2] || "0");
    const seconds = parseInt(match?.[3] || "0");
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return { id: video.id, title: cleanedTitle, duration: totalSeconds };
  });

  const filteredVideos =
    duration === "short"
      ? videos.filter((video: VideoData) => video.duration < 4 * 60)
      : videos.filter((video: VideoData) => video.duration >= 4 * 60);

  if (filteredVideos.length === 0)
    throw new Error(`Nenhum vídeo ${duration === "short" ? "curto" : "médio/longo"} encontrado`);

  const latest = filteredVideos[0];
  setCache(cacheKey, latest, CACHE_TTL);
  return latest;
};
