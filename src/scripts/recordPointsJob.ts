import cron from "node-cron";
import { fetchStreamerPosition } from "../services/futureLegendsService";
import { saveRecord } from "../services/recordService";

async function recordOnce(streamer: string) {
  try {
    const data = await fetchStreamerPosition(streamer);
    if (!data) return;
    const points = typeof (data as any).a === "number" ? (data as any).a : (data as any).score ?? 0;
    await saveRecord({ streamer, points, ts: new Date().toISOString() });
  } catch (err) {
    console.error("recordOnce error for", streamer, err);
  }
}

const TRACKED_STREAMERS = ["haidtv"];

cron.schedule("*/10 * * * *", async () => {
  for (const s of TRACKED_STREAMERS) {
    await recordOnce(s);
  }
});

export async function runRecordNow(streamers: string[]) {
  for (const s of streamers) await recordOnce(s);
}