import './Tracker.css'

interface Props {
  wpm: number
  cpm: number
  accuracy: number
  focus: string
}

export default function Tracker({ wpm, cpm, accuracy, focus }: Props) {
  return (
    <div className="panel tracker">
      <div className="panel-label">STATS</div>
      <div className="tracker-grid">
        <div className="stat">
          <span className="stat-value">{wpm}</span>
          <span className="stat-label">WPM</span>
        </div>
        <div className="stat">
          <span className="stat-value">{cpm}</span>
          <span className="stat-label">CPM</span>
        </div>
        <div className="stat">
          <span className="stat-value">{accuracy}<span className="stat-unit">%</span></span>
          <span className="stat-label">ACCURACY</span>
        </div>
        <div className="stat focus-stat">
          <span className="stat-value focus-value">{focus}</span>
          <span className="stat-label">FOCUS</span>
        </div>
      </div>
    </div>
  )
}
