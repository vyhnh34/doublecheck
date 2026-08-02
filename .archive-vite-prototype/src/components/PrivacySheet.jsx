import PrivacyDetails from './PrivacyDetails.jsx'

/*
  Mobile: a bottom sheet with the full privacy details, opened by tapping the
  grade chip next to the + in the composer. Hidden on desktop (CSS).
  Closes by tapping the dimmed backdrop.
*/
export default function PrivacySheet({ open, status, analysis, showLetter = true, onClose }) {
  if (!open) return null

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div
        className="sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Privacy details"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <PrivacyDetails status={status} analysis={analysis} showLetter={showLetter} />
      </div>
    </div>
  )
}
