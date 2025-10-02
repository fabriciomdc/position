import { Request, Response } from "express";
import { fetchStreamerPosition } from "../services/futureLegendsService";
import { formatFutureLegendsMessage, formatFutureLegendsTopMessage } from "../utils/formatMessages";

export const getStreamerPosition = async (req: Request, res: Response) => {
  const streamer = req.params.streamer;

  try {
    const data = await fetchStreamerPosition(streamer);
    if (!data) return res.status(404).send("Streamer not found");

    const { position, score, nextScore } = data;
    const pointsToNext = nextScore !== null ? +(nextScore - score).toFixed(2) : undefined;

    const message = formatFutureLegendsMessage(streamer, position, score, pointsToNext);
    res.send(message);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching streamer position.");
  }
};

export const getStreamerTarget = async (req: Request, res: Response) => {
  const streamer = req.params.streamer;
  const meta = parseInt(req.params.meta, 10);

  if (isNaN(meta) || meta <= 0) {
    return res.status(400).send("Invalid target. Use a positive number (ex: 50, 20, 10, 1).");
  }

  try {
    const data = await fetchStreamerPosition(streamer);
    if (!data) return res.status(404).send("Streamer not found");

    const { position, score, rankList } = data;
    const target = rankList[meta - 1];
    if (!target) return res.status(404).send(`Top ${meta} does not exist.`);

    const pointsTarget = score < target.a ? +(target.a - score).toFixed(2) : undefined;

    const message = formatFutureLegendsTopMessage(
      streamer,
      position,
      score,
      meta,
      pointsTarget
    );

    res.send(message);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching target position.");
  }
};
