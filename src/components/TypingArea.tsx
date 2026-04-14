import { useEffect, useRef } from 'react'
import './TypingArea.css'

interface Props {
  words: string[]
  typed: string
  currentWordIndex: number
  wordStatuses: ('correct' | 'wrong' | 'pending')[]
}

export default function TypingArea({ words, typed, currentWordIndex, wordStatuses }: Props) {
  const currentRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentWordIndex])

  return (
    <div className="panel typing-area">
      <div className="panel-label">TYPE</div>
      <div className="words-container">
        {words.map((word, wi) => {
          const isActive = wi === currentWordIndex
          const status = wordStatuses[wi]
          const chars = isActive ? typed : (status === 'pending' ? '' : word)

          return (
            <span
              key={wi}
              ref={isActive ? currentRef : null}
              className={`word ${isActive ? 'active' : ''} ${!isActive && status !== 'pending' ? status : ''}`}
            >
              {word.split('').map((ch, ci) => {
                let cls = 'char dim'
                if (isActive) {
                  if (ci < chars.length) {
                    cls = chars[ci] === ch ? 'char correct' : 'char wrong'
                  } else if (ci === chars.length) {
                    cls = 'char cursor'
                  }
                } else if (status === 'correct') {
                  cls = 'char correct'
                } else if (status === 'wrong') {
                  cls = 'char wrong'
                }
                return <span key={ci} className={cls}>{ch}</span>
              })}
              {isActive && chars.length > word.length && (
                <span className="char wrong">{chars.slice(word.length)}</span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
