import axios from "axios";

const CHAMPIONSHIP_URL =
  "https://sg-apps.vasdgame.com/ide/?instanceid=4008550&sIdeFlow=fpUvOr";

export const fetchStreamerPosition = async (streamer: string) => {
  const response = await axios.get(CHAMPIONSHIP_URL);
  const rankList = response.data.jData.rank || [];

  rankList.sort((p1: any, p2: any) => p2.a - p1.a);
  const streamerData = rankList.find(
    (r: any) => r.ul.toLowerCase() === streamer.toLowerCase()
  );

  if (!streamerData) return null;

  const position = rankList.indexOf(streamerData) + 1;
  const score = streamerData.a;
  const nextScore = position > 1 ? rankList[position - 2].a : null;

  return { position, score, nextScore };
};
