import { useEffect, useRef, useState } from 'react'
import { Lock, LockOpen, Settings } from 'lucide-react'

export default function AnonymizationControl({ enabled, onEnabledChange, onOpenSettings }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const switchRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return undefined

    switchRef.current?.focus()
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const stateLabel = enabled ? 'on' : 'off'

  return (
    <div className="anonymization-control" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`tool circle anonymization-trigger is-${stateLabel}`}
        title={`Anonymisation ${stateLabel}`}
        aria-label={`Anonymisation ${stateLabel}`}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        onClick={() => setMenuOpen((current) => !current)}
      >
        {enabled ? <Lock aria-hidden="true" /> : <LockOpen aria-hidden="true" />}
      </button>

      {menuOpen && (
        <div className="anonymization-menu" role="menu" aria-label="Anonymisation settings">
          <div className="anonymization-menu-row" role="none">
            <span>Anonymisation</span>
            <span className="anonymization-menu-controls">
              <button
                ref={switchRef}
                type="button"
                className={`privacy-switch${enabled ? ' is-on' : ''}`}
                role="switch"
                aria-checked={enabled}
                aria-label="Anonymisation"
                onClick={() => onEnabledChange(!enabled)}
              >
                <span aria-hidden="true" />
              </button>
              <button
                type="button"
                className="anonymization-settings-button"
                aria-label="Open anonymisation settings"
                onClick={() => {
                  setMenuOpen(false)
                  onOpenSettings()
                }}
              >
                <Settings aria-hidden="true" />
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
