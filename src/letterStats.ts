export interface LetterStat {
  attempts: number
  errors: number
  totalLatencyMs: number
}

export type LetterStatsMap = Record<string, LetterStat>

export function emptyStats(): LetterStatsMap {
  return {}
}

export function recordKeystroke(
  map: LetterStatsMap,
  letter: string,
  correct: boolean,
  latencyMs: number
): LetterStatsMap {
  const prev = map[letter] ?? { attempts: 0, errors: 0, totalLatencyMs: 0 }
  return {
    ...map,
    [letter]: {
      attempts: prev.attempts + 1,
      errors: prev.errors + (correct ? 0 : 1),
      totalLatencyMs: prev.totalLatencyMs + latencyMs,
    },
  }
}

/** Score a letter: higher = worse. Combines error rate and avg latency. */
function score(stat: LetterStat, globalAvgLatency: number): number {
  const errorRate = stat.errors / stat.attempts
  const avgLatency = stat.totalLatencyMs / stat.attempts
  const latencyRatio = globalAvgLatency > 0 ? avgLatency / globalAvgLatency : 1
  return errorRate * 0.6 + (latencyRatio - 1) * 0.4
}

/** Returns the top N worst letters as a focus label, e.g. "z · v · q" */
export function deriveFocus(map: LetterStatsMap, n = 3): string {
  const globalAvg =
    Object.values(map).reduce((s, v) => s + v.totalLatencyMs / v.attempts, 0) /
    (Object.keys(map).length || 1)

  const qualified = Object.entries(map).filter(([, s]) => s.attempts >= 3)
  if (qualified.length === 0) return '—'

  return qualified
    .sort(([, a], [, b]) => score(b, globalAvg) - score(a, globalAvg))
    .slice(0, n)
    .map(([ch]) => ch.toUpperCase())
    .join(' · ')
}
