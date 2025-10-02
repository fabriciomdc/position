import { Request, Response } from "express";
import { fetchStreamerPosition } from "../services/futureLegendsService";
import { formatFutureLegendsMessage } from "../utils/formatMessages";
import { computeMetrics, projectionDaysToReach, neededPerDayToReach } from "../utils/metrics";
import { FutureLegendsData } from "../types/futureLegends";
import { getRecordsForStreamer } from "../services/recordService";
import { deltasFromRecords, movingAverage } from "../utils/pointsAverage";
import { summarizeRecordsForDay } from "../utils/dailyPoints";

export const getStreamerPosition = async (req: Request, res: Response) => {
  const streamer = req.params.streamer;
  const customText = req.query.text as string | undefined;

  try {
    const data = await fetchStreamerPosition(streamer);
    if (!data) return res.status(404).send("Streamer not found");

    const { position, score, nextScore } = data as { position: any; score: any; nextScore: any };

    let message = formatFutureLegendsMessage(streamer, position, score, customText);

    if (nextScore !== null && typeof nextScore !== "undefined") {
      const missing = (nextScore as number) - (score as number);
      message += ` Faltam ${missing.toFixed(2)} pontos para alcançar a próxima posição`;
    } else {
      message += ` Parabéns! Ele está em primeiro lugar 🏆.`;
    }

    res.send(message);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar posição.");
  }
};

export const getFutureLegendsStats = async (req: Request, res: Response) => {
  const streamer = req.params.streamer;
  const prazoDays = Number(req.query.prazoDays) || 7;

  try {
    const dataRaw = await fetchStreamerPosition(streamer);
    if (!dataRaw) return res.status(404).json({ error: "Streamer not found" });

    const data = dataRaw as Partial<FutureLegendsData> & {
      position?: number;
      score?: number;
      nextScore?: number | null;
      a?: number;
      d?: number;
      w?: number;
      k?: number;
      t?: number;
      championshipStartDate?: string;
    };

    const a = typeof data.a === "number" ? data.a : typeof data.score === "number" ? data.score : 0;
    const d = typeof data.d === "number" ? data.d : 0;
    const w = typeof data.w === "number" ? data.w : 0;
    const k = typeof data.k === "number" ? data.k : 0;
    const t = typeof data.t === "number" ? data.t : 0;
    const nextScore = typeof data.nextScore === "number" || data.nextScore === null ? data.nextScore : null;
    const championshipStartDate = typeof data.championshipStartDate === "string" ? data.championshipStartDate : undefined;

    const metrics = computeMetrics({
      a,
      d,
      w,
      k,
      t,
      championshipStartDate,
      nextScore,
    });

    const missing = nextScore != null ? Math.max(0, (nextScore as number) - a) : null;
    const daysToReach = nextScore != null ? projectionDaysToReach(a, nextScore as number, metrics.ptsPerCalendarDay) : null;
    const neededPerDayForPrazo = nextScore != null ? neededPerDayToReach(a, nextScore as number, prazoDays) : null;

    res.json({
      championship: "FutureLegends",
      streamer,
      metrics,
      nextScore: nextScore ?? null,
      missing,
      daysToReach,
      neededPerDayForPrazo,
      prazoDays,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching FutureLegends stats." });
  }
};

export const getFutureLegendsIntervalStats = async (req: Request, res: Response) => {
  const streamerParam = req.params.streamer;
  const allowedStreamer = "haidtv";
  if (streamerParam !== allowedStreamer) {
    return res.status(403).json({ error: `Interval stats available only for ${allowedStreamer}` });
  }

  const window = Number(req.query.window) || 6;
  const targetDate = (req.query.date as string) || new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const tzOffset = req.query.tzOffset ? Number(req.query.tzOffset) : 0; // minutos

  try {
    const records = await getRecordsForStreamer(allowedStreamer);
    if (!records || records.length < 2) {
      return res.status(404).json({ error: `Not enough records for ${allowedStreamer}` });
    }

    const deltas = deltasFromRecords(records);
    const avgPer30m = movingAverage(deltas, window, 30);

    // daily summary (last - first) e pointsDay (alias, aqui usamos last - first)
    const daySummary = summarizeRecordsForDay(allowedStreamer, records, targetDate, tzOffset);
    const dailyDelta = daySummary.recordsCount > 0 ? daySummary.deltaLastMinusFirst ?? 0 : null;
    const pointsDay = dailyDelta; // se preferir max-min, usar daySummary.deltaMaxMinusMin

    res.json({
      championship: "FutureLegends",
      streamer: allowedStreamer,
      intervalsRecorded: deltas.length,
      avgPointsPer30Minutes: avgPer30m,
      lastInterval: deltas[deltas.length - 1] ?? null,
      date: targetDate,
      tzOffsetMinutes: tzOffset,
      daily: {
        recordsCount: daySummary.recordsCount,
        firstRecord: daySummary.firstRecord ?? null,
        lastRecord: daySummary.lastRecord ?? null,
        minPoints: daySummary.minPoints ?? null,
        maxPoints: daySummary.maxPoints ?? null,
        dailyDelta,
        pointsDay,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error computing interval stats" });
  }
};
