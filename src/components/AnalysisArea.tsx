import { LetterStatsMap } from '../letterStats'
import './AnalysisArea.css'

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

interface Props {
  stats: LetterStatsMap
  aiSummary: string | null
  problematicChars: { character: string; reason: string }[]
  recommendedWords: string[]
  loading: boolean
  onUseRecommendedWords: () => void
}

function getHeat(errorRate: number, latencyRatio: number): number {
  return Math.min(1, errorRate * 0.6 + Math.max(0, latencyRatio - 1) * 0.4)
}

export default function AnalysisArea({ stats, aiSummary, problematicChars, recommendedWords, loading, onUseRecommendedWords }: Props) {
  aiSummary += "\n Powered By [Nova Lite]"
  const globalAvg =
    Object.values(stats).reduce((s, v) => s + v.totalLatencyMs / v.attempts, 0) /
    (Object.keys(stats).length || 1)

  return (
    <div className="panel analysis-area">
      <div className="panel-label">LETTER ANALYSIS</div>
      <div className="analysis-layout">

        <div className="analysis-summary">
          <div className="summary-block">
            <span className="summary-label">PROBLEMATIC CHARS</span>
            <div className="summary-chars">
              {loading
                ? <span className="summary-loading">ANALYSING_</span>
                : problematicChars.length > 0
                  ? problematicChars.map(({ character, reason }) => (
                      <span key={character} className="summary-char" title={reason}>
                        {character.toUpperCase()}
                      </span>
                    ))
                  : <span className="summary-empty">—</span>
              }
            </div>
          </div>

          <div className="summary-block">
            <span className="summary-label">AI ANALYSIS</span>
            <p className="summary-text">
              {loading
                ? <span className="summary-loading">PROCESSING INPUT DATA_</span>
                : aiSummary ?? <span className="summary-empty">Complete a round to generate analysis.</span>
              }
            </p>
          </div>

          <button
            className="tips-button"
            onClick={onUseRecommendedWords}
            disabled={recommendedWords.length === 0}
          >
            [ USE AI RECOMMENDED WORDS ]
          </button>
        </div>

        <div className="analysis-rows">
          {ROWS.map((row, ri) => (
            <div key={ri} className="analysis-row">
              {row.split('').map((ch) => {
                const s = stats[ch]
                if (!s || s.attempts === 0) {
                  return (
                    <div key={ch} className="letter-cell empty">
                      <span className="lc-key">{ch}</span>
                    </div>
                  )
                }
                const errorRate = s.errors / s.attempts
                const avgLatency = s.totalLatencyMs / s.attempts
                const latencyRatio = globalAvg > 0 ? avgLatency / globalAvg : 1
                const heat = getHeat(errorRate, latencyRatio)
                const r = Math.round(heat * 204)
                const g = Math.round((1 - heat) * 100)
                const color = `rgb(${r},${g},0)`

                return (
                  <div
                    key={ch}
                    className="letter-cell"
                    style={{ borderColor: color, boxShadow: heat > 0.3 ? `0 0 6px ${color}44` : 'none' }}
                    title={`${ch}: ${s.attempts} attempts · ${Math.round(errorRate * 100)}% errors · ${Math.round(avgLatency)}ms avg`}
                  >
                    <span className="lc-key" style={{ color }}>{ch}</span>
                    <span className="lc-acc">{Math.round((1 - errorRate) * 100)}%</span>
                    <span className="lc-lat">{Math.round(avgLatency)}ms</span>
                  </div>
                )
              })}
            </div>
          ))}
          <div className="analysis-legend">
            <span className="legend-good">■ FAST · ACCURATE</span>
            <span className="legend-bad">■ SLOW · ERRORS</span>
          </div>
        </div>

      </div>
    </div>
  )
}
