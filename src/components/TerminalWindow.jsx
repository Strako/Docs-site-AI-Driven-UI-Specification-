import { useState } from 'react'
import './TerminalWindow.css'

function renderLine(line, idx) {
  const { type, text } = line

  switch (type) {
    case 'command':
      return (
        <div key={idx} className="tl tl-command">
          <span className="tl-prompt">$ </span>
          <span className="tl-text">{text}</span>
        </div>
      )
    case 'output':
      return <div key={idx} className="tl tl-output">{text}</div>
    case 'success':
      return <div key={idx} className="tl tl-success">{text}</div>
    case 'error':
      return <div key={idx} className="tl tl-error">{text}</div>
    case 'warning':
      return <div key={idx} className="tl tl-warning">{text}</div>
    case 'banner':
      return <div key={idx} className="tl tl-banner">{text}</div>
    case 'separator':
      return <div key={idx} className="tl tl-separator">{text}</div>
    case 'user':
      return (
        <div key={idx} className="tl tl-user">
          <span className="tl-user-arrow">&gt; </span>
          <span className="tl-text">{text}</span>
        </div>
      )
    case 'file':
      return <div key={idx} className="tl tl-file">{text}</div>
    case 'comment':
      return <div key={idx} className="tl tl-comment"># {text}</div>
    case 'blank':
      return <div key={idx} className="tl tl-blank">&nbsp;</div>
    case 'cursor':
      return (
        <div key={idx} className="tl tl-command">
          <span className="tl-prompt">$ </span>
          <span className="cursor" />
        </div>
      )
    default:
      return <div key={idx} className="tl tl-output">{text}</div>
  }
}

export default function TerminalWindow({ title = 'bash', lines = [], className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = lines
      .map(l => {
        if (l.type === 'command') return `$ ${l.text}`
        if (l.type === 'blank') return ''
        return l.text
      })
      .join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="terminal-title">{title}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <div className="terminal-body">
        {lines.map((line, idx) => renderLine(line, idx))}
      </div>
    </div>
  )
}
