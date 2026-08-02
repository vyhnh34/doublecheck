import { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'

const PRIVACY_CATEGORIES = [
  {
    id: 'person',
    label: 'Name',
    description: "People's names that could identify who you're talking about.",
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'Email addresses or phone numbers that can identify or reach someone.',
  },
  {
    id: 'location',
    label: 'Location',
    description: 'Places that may reveal where someone is or plans to be.',
  },
  {
    id: 'time',
    label: 'Timing',
    description: 'Dates or times that may reveal routines or future plans.',
  },
]

export const ALL_PRIVACY_CATEGORIES = PRIVACY_CATEGORIES.map(({ id }) => id)

export default function AutoAnonymizationModal({
  open,
  mode = 'setup',
  enabledCategories,
  showAnonymizedWords,
  onToggleCategory,
  onToggleShowAnonymizedWords,
  onPrimary,
  onSecondary,
  onClose,
}) {
  const primaryActionRef = useRef(null)
  const [activeInfo, setActiveInfo] = useState(null)

  useEffect(() => {
    if (!open) return undefined

    primaryActionRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) {
      setActiveInfo(null)
      return undefined
    }

    const handleDialogKeys = (event) => {
      if (event.key === 'Escape') {
        if (activeInfo) {
          setActiveInfo(null)
          return
        }
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const controls = event.currentTarget.querySelectorAll(
        '.auto-anonymize-modal button:not([disabled])',
      )
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    const closeInfoOutside = (event) => {
      if (!(event.target instanceof Element) || !event.target.closest('.category-info')) {
        setActiveInfo(null)
      }
    }
    document.addEventListener('keydown', handleDialogKeys)
    document.addEventListener('pointerdown', closeInfoOutside)
    return () => {
      document.removeEventListener('keydown', handleDialogKeys)
      document.removeEventListener('pointerdown', closeInfoOutside)
    }
  }, [open, activeInfo, onClose])

  if (!open) return null

  const settingsMode = mode === 'settings'

  return (
    <div
      className="auto-anonymize-overlay"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="auto-anonymize-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auto-anonymize-title"
      >
        <h2 id="auto-anonymize-title">
          {settingsMode ? 'Anonymisation settings' : 'Want to turn on auto-anonymization?'}
        </h2>

        <div className="auto-anonymize-list" aria-label="Information to anonymize">
          {PRIVACY_CATEGORIES.map((category) => {
            const enabled = enabledCategories.has(category.id)
            const infoOpen = activeInfo === category.id
            const tooltipId = `category-info-${category.id}`
            return (
              <div className="auto-anonymize-row" key={category.id}>
                <span className="category-label">
                  {category.label}
                  <span
                    className="category-info"
                    onMouseEnter={() => setActiveInfo(category.id)}
                    onMouseLeave={(event) => {
                      if (event.currentTarget.contains(document.activeElement)) return
                      setActiveInfo((current) => (current === category.id ? null : current))
                    }}
                    onFocus={() => setActiveInfo(category.id)}
                    onBlur={(event) => {
                      if (
                        !event.currentTarget.contains(event.relatedTarget)
                        && !event.currentTarget.matches(':hover')
                      ) setActiveInfo(null)
                    }}
                  >
                    <button
                      type="button"
                      className="category-info-button"
                      aria-label={`About ${category.label}`}
                      aria-expanded={infoOpen}
                      aria-describedby={infoOpen ? tooltipId : undefined}
                      onClick={() => setActiveInfo(category.id)}
                    >
                      <Info aria-hidden="true" />
                    </button>
                    {infoOpen && (
                      <span
                        id={tooltipId}
                        className={`category-info-tooltip${category.id === 'time' ? ' is-above' : ''}`}
                        role="tooltip"
                      >
                        {category.description}
                      </span>
                    )}
                  </span>
                </span>
                <button
                  type="button"
                  className={`privacy-switch${enabled ? ' is-on' : ''}`}
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`Anonymize ${category.label}`}
                  onClick={() => onToggleCategory(category.id)}
                >
                  <span aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </div>

        <label className="show-anonymized-option">
          <input
            type="checkbox"
            checked={showAnonymizedWords}
            onChange={(event) => onToggleShowAnonymizedWords(event.target.checked)}
          />
          <span>Show anonymized words</span>
        </label>

        <div className="auto-anonymize-actions">
          <button
            ref={primaryActionRef}
            type="button"
            className="auto-anonymize-primary"
            onClick={onPrimary}
          >
            {settingsMode ? 'Save changes' : 'Turn on'}
          </button>
          <button
            type="button"
            className="auto-anonymize-secondary"
            onClick={onSecondary}
          >
            {settingsMode ? 'Cancel' : 'Send without anonymizing'}
          </button>
        </div>
      </section>
    </div>
  )
}
