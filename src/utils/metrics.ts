// src/utils/metrics.ts
export type FutureLegendsPayload = {
  a: number; // total points
  d: number; // hours streamed
  w?: number; // hours watched (max 200)
  k?: number; // kills
  t?: number; // loot extracted
  nextScore?: number | null;
  championshipStartDate?: string;
};

function safeDiv(n: number, denom: number) {
  return denom > 0 ? n / denom : 0;
}

export function computeMetrics(payload: FutureLegendsPayload, now = new Date()) {
  const { a, d, w = 0, k = 0, t = 0, championshipStartDate } = payload;

  let daysElapsed: number;
  if (championshipStartDate) {
    const start = new Date(championshipStartDate);
    const diffMs = Math.max(0, now.getTime() - start.getTime());
    daysElapsed = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  } else {
    daysElapsed = Math.max(1, Math.round(d / 24) || 1);
  }

  const ptsPerCalendarDay = safeDiv(a, daysElapsed);
  const ptsPerStreamHour = safeDiv(a, d);
  const ptsPerWatchedHour = safeDiv(a, w);
  const ptsPerKill = safeDiv(a, k);
  const ptsPerLoot = safeDiv(a, t);

  return {
    a,
    d,
    w,
    k,
    t,
    daysElapsed,
    ptsPerCalendarDay: Number(ptsPerCalendarDay.toFixed(3)),
    ptsPerStreamHour: Number(ptsPerStreamHour.toFixed(3)),
    ptsPerWatchedHour: Number(ptsPerWatchedHour.toFixed(3)),
    ptsPerKill: Number(ptsPerKill.toFixed(3)),
    ptsPerLoot: Number(ptsPerLoot.toFixed(3)),
  };
}

export function projectionDaysToReach(currentPoints: number, targetPoints: number, ptsPerDay: number) {
  if (targetPoints <= currentPoints) return 0;
  const missing = targetPoints - currentPoints;
  const rate = Math.max(0.000001, ptsPerDay);
  return Math.ceil(missing / rate);
}

export function neededPerDayToReach(currentPoints: number, targetPoints: number, days: number) {
  if (targetPoints <= currentPoints) return 0;
  const missing = targetPoints - currentPoints;
  const d = Math.max(1, Math.round(days));
  return Number((missing / d).toFixed(3));
}
