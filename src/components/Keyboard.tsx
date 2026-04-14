import './Keyboard.css'

const ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','=','⌫'],
  ['⇥','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['⇪','a','s','d','f','g','h','j','k','l',';',"'",'↵'],
  ['⇧','z','x','c','v','b','n','m',',','.','/','⇧'],
  ['SPACE'],
]

const WIDE_KEYS = new Set(['⌫','⇥','⇪','↵','⇧','SPACE'])

interface Props {
  highlight: string
}

export default function Keyboard({ highlight }: Props) {
  const target = highlight === ' ' ? 'SPACE' : highlight.toLowerCase()

  return (
    <div className="panel keyboard-panel">
      <div className="panel-label">KEYBOARD</div>
      <div className="keyboard">
        {ROWS.map((row, ri) => (
          <div key={ri} className="kb-row">
            {row.map((key) => {
              const active = key === target
              return (
                <div
                  key={key}
                  className={`key ${WIDE_KEYS.has(key) ? 'wide' : ''} ${active ? 'active' : ''}`}
                >
                  {key}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
