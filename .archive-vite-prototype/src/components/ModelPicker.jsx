import { useEffect, useRef, useState } from 'react'
import { Chevron, Check } from './icons.jsx'

// The model selector button + dropdown menu.
export default function ModelPicker({ model, models, onChange, productName = 'Claude', productTheme = 'claude' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isChatGPT = productTheme === 'chatgpt'
  const current = models.find((m) => m.id === model) ?? models[0]

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [open])

  return (
    <div className={`model-field${isChatGPT ? ' openai-model-field' : ''}`} ref={ref}>
      <button
        type="button"
        className={`model${isChatGPT ? ' openai-model' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          {!isChatGPT && <span className="label-full">{productName} </span>}
          {current?.name}
        </span>
        <Chevron className="chev" />
      </button>

      {open && (
        <div className={`menu${isChatGPT ? ' openai-model-menu' : ''}`} role="menu">
          {isChatGPT && (
            <div className="openai-menu-head">
              <span>Model</span>
              <small>Choose how ChatGPT should respond</small>
            </div>
          )}

          {models.map((m) => (
            <button
              key={m.id}
              className={`item${m.id === current?.id ? ' checked' : ''}`}
              role="menuitemradio"
              aria-checked={m.id === current?.id}
              onClick={() => { onChange(m.id); setOpen(false) }}
            >
              <span>
                <span className="model-row-title">
                  {m.name}
                  {isChatGPT && m.badge && <em>{m.badge}</em>}
                </span>
                <small>{m.note}</small>
              </span>
              <Check className="check" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
