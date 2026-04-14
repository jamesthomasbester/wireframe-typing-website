import { useState, useEffect, useCallback, useRef } from 'react'
import Tracker from './components/Tracker'
import TypingArea from './components/TypingArea'
import Keyboard from './components/Keyboard'
import AnalysisArea from './components/AnalysisArea'
import { FOCUS_SETS, getWords } from './words'
import { emptyStats, recordKeystroke, deriveFocus, LetterStatsMap } from './letterStats'
import './App.css'

type WordStatus = 'correct' | 'wrong' | 'pending'

export default function App() {
  const [focusIndex, setFocusIndex] = useState(0)
  const focusSet = FOCUS_SETS[focusIndex]

  const [words, setWords] = useState(() => getWords(focusSet))
  const [typed, setTyped] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>(() => Array(30).fill('pending'))
  const [startTime, setStartTime] = useState<number | null>(null)
  const [totalTyped, setTotalTyped] = useState(0)
  const [totalErrors, setTotalErrors] = useState(0)
  const [finished, setFinished] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [letterStats, setLetterStats] = useState<LetterStatsMap>(emptyStats)

  const inputRef = useRef<HTMLInputElement>(null)
  const lastKeyTime = useRef<number | null>(null)

  const reset = useCallback((fi = focusIndex) => {
    const fs = FOCUS_SETS[fi]
    setWords(getWords(fs))
    setTyped('')
    setCurrentWordIndex(0)
    setWordStatuses(Array(30).fill('pending'))
    setStartTime(null)
    setTotalTyped(0)
    setTotalErrors(0)
    setFinished(false)
    setElapsed(0)
    setLetterStats(emptyStats())
    lastKeyTime.current = null
    inputRef.current?.focus()
  }, [focusIndex])

  // tick elapsed
  useEffect(() => {
    if (!startTime || finished) return
    const id = setInterval(() => setElapsed(Date.now() - startTime), 200)
    return () => clearInterval(id)
  }, [startTime, finished])

  const minutes = elapsed / 60000 || 1 / 60000
  const wpm = Math.round(totalTyped / 5 / minutes)
  const cpm = Math.round(totalTyped / minutes)
  const accuracy = totalTyped === 0 ? 100 : Math.max(0, Math.round(((totalTyped - totalErrors) / totalTyped) * 100))
  const dynamicFocus = deriveFocus(letterStats)

  const nextChar = (() => {
    if (finished) return ''
    const word = words[currentWordIndex] ?? ''
    if (typed.length < word.length) return word[typed.length]
    return ' '
  })()

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return
    const val = e.target.value
    const now = Date.now()

    if (!startTime) setStartTime(now)

    // record per-letter stat for the newly typed character (not backspace/space)
    const isAddingChar = val.length > typed.length && !val.endsWith(' ')
    if (isAddingChar) {
      const newChar = val[val.length - 1]
      const expectedChar = words[currentWordIndex]?.[val.length - 1]
      const latency = lastKeyTime.current !== null ? now - lastKeyTime.current : 150
      const correct = newChar === expectedChar
      setLetterStats(prev => recordKeystroke(prev, newChar, correct, latency))
      lastKeyTime.current = now
    }

    // space pressed = submit word
    if (val.endsWith(' ')) {
      const attempt = val.trimEnd()
      const word = words[currentWordIndex]
      const correct = attempt === word

      // count errors in this word
      let errs = 0
      for (let i = 0; i < Math.max(attempt.length, word.length); i++) {
        if (attempt[i] !== word[i]) errs++
      }

      setTotalTyped(t => t + attempt.length + 1)
      setTotalErrors(t => t + errs)
      setWordStatuses(s => {
        const next = [...s]
        next[currentWordIndex] = correct ? 'correct' : 'wrong'
        return next
      })

      const nextIndex = currentWordIndex + 1
      if (nextIndex >= words.length) {
        setFinished(true)
        setElapsed(Date.now() - (startTime ?? Date.now()))
      } else {
        setCurrentWordIndex(nextIndex)
      }
      setTyped('')
      lastKeyTime.current = now
      return
    }

    setTotalTyped(t => t + Math.max(0, val.length - typed.length))
    setTyped(val)
  }, [finished, startTime, words, currentWordIndex, typed])

  useEffect(() => { inputRef.current?.focus() }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">WIRE<span className="red">FRAME</span> · TYPE</div>
        <div className="focus-selector">
          {FOCUS_SETS.map((fs, i) => (
            <button
              key={i}
              className={`focus-btn ${i === focusIndex ? 'active' : ''}`}
              onClick={() => { setFocusIndex(i); reset(i) }}
            >
              {fs.label}
            </button>
          ))}
        </div>
      </header>

      <Tracker wpm={wpm} cpm={cpm} accuracy={accuracy} focus={dynamicFocus} />

      <div className="spacer" />

      <TypingArea
        words={words}
        typed={typed}
        currentWordIndex={currentWordIndex}
        wordStatuses={wordStatuses}
      />

      <input
        ref={inputRef}
        className="hidden-input"
        value={typed}
        onChange={handleInput}
        disabled={finished}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onBlur={() => inputRef.current?.focus()}
      />

      {finished && (
        <div className="result-overlay panel">
          <div className="panel-label">RESULT</div>
          <div className="result-stats">
            <span>{wpm} <small>WPM</small></span>
            <span>{cpm} <small>CPM</small></span>
            <span>{accuracy}<small>%</small></span>
          </div>
          <button className="restart-btn" onClick={() => reset()}>[ RESTART ]</button>
        </div>
      )}

      <div className="spacer" />

      <Keyboard highlight={nextChar} />

      <AnalysisArea stats={letterStats} />
    </div>
  )
}
