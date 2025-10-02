import { PointRecord } from "../types/records";

export type Delta = {
  from: string;
  to: string;
  minutes: number;
  delta: number;
};

export function deltasFromRecords(records: PointRecord[]): Delta[] {
  if (!records || records.length < 2) return [];
  const sorted = records.slice().sort((a, b) => a.ts.localeCompare(b.ts));
  const deltas: Delta[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const delta = Math.max(0, cur.points - prev.points);
    const minutes = (new Date(cur.ts).getTime() - new Date(prev.ts).getTime()) / (1000 * 60);
    deltas.push({ from: prev.ts, to: cur.ts, minutes: Math.max(1, minutes), delta });
  }
  return deltas;
}

export function averagePointsPerInterval(deltas: Delta[], targetMinutes = 30): number {
  if (!deltas || deltas.length === 0) return 0;
  const normalized = deltas.map(d => (d.delta * targetMinutes) / d.minutes);
  const sum = normalized.reduce((s, v) => s + v, 0);
  return sum / normalized.length;
}

export function movingAverage(deltas: Delta[], window = 6, targetMinutes = 30): number {
  const slice = deltas.slice(-window);
  const avg = averagePointsPerInterval(slice, targetMinutes);
  return Number(avg.toFixed(3));
}