import { PointRecord } from "../types/records";

export type DaySummary = {
  date: string;
  recordsCount: number;
  firstRecord?: PointRecord;
  lastRecord?: PointRecord;
  minPoints?: number;
  maxPoints?: number;
  deltaLastMinusFirst?: number;
  deltaMaxMinusMin?: number;
};

export function isoDateFromTs(ts: string, tzOffsetMinutes = 0): string {
  const d = new Date(ts);
  const localMs = d.getTime() + tzOffsetMinutes * 60 * 1000;
  const local = new Date(localMs);
  const yyyy = local.getUTCFullYear();
  const mm = String(local.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(local.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function summarizeRecordsForDay(
  streamer: string,
  records: PointRecord[],
  targetDateISO: string,
  tzOffsetMinutes = 0
): DaySummary {
  const filtered = records.filter((r) => isoDateFromTs(r.ts, tzOffsetMinutes) === targetDateISO);
  if (filtered.length === 0) {
    return { date: targetDateISO, recordsCount: 0 };
  }
  const sorted = filtered.slice().sort((a, b) => a.ts.localeCompare(b.ts));
  const firstRecord = sorted[0];
  const lastRecord = sorted[sorted.length - 1];
  const pointsList = sorted.map((r) => r.points);
  const minPoints = Math.min(...pointsList);
  const maxPoints = Math.max(...pointsList);
  return {
    date: targetDateISO,
    recordsCount: filtered.length,
    firstRecord,
    lastRecord,
    minPoints,
    maxPoints,
    deltaLastMinusFirst: Number((lastRecord.points - firstRecord.points).toFixed(6)),
    deltaMaxMinusMin: Number((maxPoints - minPoints).toFixed(6)),
  };
}
