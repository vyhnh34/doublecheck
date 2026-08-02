import PrivacyDetails from './PrivacyDetails.jsx'

/*
  Desktop: a gentle, non-blocking privacy grade card, top-right.
  Hidden on mobile (CSS) — phones use the inline grade chip + PrivacySheet.
*/
export default function PrivacyNudge({ status, analysis, showLetter = true }) {
  if (status === 'idle' || !status) return null

  return (
    <aside className="privacy-nudge" role="status" aria-live="polite" aria-busy={status === 'analyzing'}>
      <PrivacyDetails status={status} analysis={analysis} showLetter={showLetter} />
    </aside>
  )
}
