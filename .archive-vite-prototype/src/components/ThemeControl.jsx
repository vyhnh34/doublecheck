import { useEffect, useRef, useState } from 'react'
import { Check, Moon, Settings, Sun } from './icons.jsx'
import { VERSIONS } from '../versions.js'

const PRODUCT_THEMES = [
  { id: 'claude', label: 'Claude' },
  { id: 'chatgpt', label: 'ChatGPT' },
]

const COLOR_MODES = [
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
]

const TOOL_CONTROLS = [
  { id: 'agentation', label: 'Agentation' },
  { id: 'interfaceKit', label: 'Interface Kit' },
]

const ONBOARDING_VIEWS = [
  { id: 'mobile',  label: 'Mobile'  },
  { id: 'desktop', label: 'Desktop' },
]

export default function ThemeControl({
  version,
  productTheme,
  colorMode,
  tools,
  onboardingView,
  s2variant,
  onVersionChange,
  onProductThemeChange,
  onColorModeChange,
  onToolChange,
  onOnboardingViewChange,
  onS2variantChange,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [open])

  return (
    <div className="theme-control" ref={ref}>
      {open && (
        <div className="theme-panel" role="menu" aria-label="Design controls">
          <section className="theme-section" aria-label="Interaction version">
            <p className="theme-section-title">Version</p>
            <div className="theme-options">
              {VERSIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`theme-option${v.id === version ? ' selected' : ''}`}
                  onClick={() => onVersionChange(v.id)}
                >
                  <span>{v.label}</span>
                  <Check className="theme-check" />
                </button>
              ))}
            </div>
          </section>

          {version === 'onboarding' && (
            <section className="theme-section" aria-label="Screen 2 design variant">
              <p className="theme-section-title">Design</p>
              <div className="theme-segmented" role="group" aria-label="Screen 2 design variant">
                {['A', 'B'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`theme-segment${v === s2variant ? ' selected' : ''}`}
                    onClick={() => onS2variantChange(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="theme-section" aria-label="Product theme">
            <p className="theme-section-title">Theme</p>
            <div className="theme-segmented" role="group" aria-label="Product theme">
              {PRODUCT_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-segment${theme.id === productTheme ? ' selected' : ''}`}
                  onClick={() => onProductThemeChange(theme.id)}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </section>

          <section className="theme-section" aria-label="Color mode">
            <p className="theme-section-title">Mode</p>
            <div className="theme-segmented" role="group" aria-label="Color mode">
              {COLOR_MODES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`theme-segment${id === colorMode ? ' selected' : ''}`}
                  onClick={() => onColorModeChange(id)}
                >
                  <span className="theme-option-label"><Icon />{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="theme-section" aria-label="Design tools">
            <p className="theme-section-title">Tools</p>
            <div className="theme-options">
              {TOOL_CONTROLS.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  className={`theme-option${tools[tool.id] ? ' selected' : ''}`}
                  onClick={() => onToolChange(tool.id, !tools[tool.id])}
                >
                  <span>{tool.label}</span>
                  <Check className="theme-check" />
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      <button
        type="button"
        className={`theme-trigger${open ? ' active' : ''}`}
        aria-label="Open design controls"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Settings />
      </button>
    </div>
  )
}
