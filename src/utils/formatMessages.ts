
export const formatVideoMessage = (
  videoId: string,
  title: string,
  text?: string
) => {
  const prefix =
    text || "🟢 Último vídeo já tá no ar! 🟢";
  const link = `https://www.youtube.com/watch?v=${videoId}`;
  return `${prefix}\n\n📌 ${title}:\n${link}`;
};


export const formatShortMessage = (
  videoId: string,
  title: string,
  text?: string
) => {
  const prefix =
    text || "🟢 Último short já tá no ar! 🟢";
  const link = `https://www.youtube.com/watch?v=${videoId}`;
  return `${prefix}\n\n📌 ${title}:\n${link}`;
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

