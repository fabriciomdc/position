
export const formatVideoMessage = (videoId: string, text?: string) => {
  const prefix = text || "🟢Vídeo novo no canal rapaziada🟢, Cola lá pra da uma força. Aquele likezada e comentário TMJ⭐⭐!!";
  const link = `https://www.youtube.com/watch?v=${videoId}`;
  return `${prefix} ${link}`;
};


export const formatShortMessage = (videoId: string, text?: string) => {
  const prefix = text || "🟢Shorts novo no canal rapaziada🟢, Cola lá pra da uma força. Aquele likezada e comentário TMJ⭐⭐!!";
  const link = `https://www.youtube.com/watch?v=${videoId}`;
  return `${prefix} ${link}`;
};


export const formatFutureLegendsMessage = (
  streamer: string,
  position: number,
  score: number,
  text?: string
) => {
  const prefix = text || "Rank Future Legends S3";
  return `${prefix} ${streamer}: está na posição 🏆${position} com 💥${score} pontos.`;
};

