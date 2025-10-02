import fs from "fs";
import path from "path";
import { PointRecord } from "../types/records";

const FILE = path.join(process.cwd(), "data", "point_records.json");
const MAX_RECORDS_PER_STREAMER = 5000;

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]), "utf8");
}

export async function saveRecord(record: PointRecord): Promise<void> {
  ensureFile();
  const raw = fs.readFileSync(FILE, "utf8");
  const all: PointRecord[] = JSON.parse(raw || "[]");
  all.push(record);
  const grouped = new Map<string, PointRecord[]>();
  for (const r of all) {
    const arr = grouped.get(r.streamer) ?? [];
    arr.push(r);
    grouped.set(r.streamer, arr);
  }
  const trimmed: PointRecord[] = [];
  for (const [_, arr] of grouped) {
    const keep = arr.slice(-MAX_RECORDS_PER_STREAMER);
    trimmed.push(...keep);
  }
  fs.writeFileSync(FILE, JSON.stringify(trimmed), "utf8");
}

export async function getRecordsForStreamer(streamer: string): Promise<PointRecord[]> {
  ensureFile();
  const raw = fs.readFileSync(FILE, "utf8");
  const all: PointRecord[] = JSON.parse(raw || "[]");
  return all.filter((r) => r.streamer === streamer).sort((a, b) => a.ts.localeCompare(b.ts));
}
