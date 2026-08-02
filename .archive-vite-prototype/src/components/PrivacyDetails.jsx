import { SEVERITY_COLOR } from '../privacy.js'

/*
  The inner content of the privacy feedback — shared by the desktop top-right
  card (PrivacyNudge) and the mobile bottom sheet (PrivacySheet) so they never
  drift apart. Handles both the loading and settled states.
*/
export default function PrivacyDetails({ status, analysis, showLetter = true }) {
  // Loading: spinner + skeleton rows.
  if (status === 'analyzing' || !analysis) {
    return (
      <>
        <div className="pn-head">
          <span className="pn-grade pn-grade--loading" aria-hidden="true"><span className="pn-spinner" /></span>
          <div>
            <p className="pn-title">Checking your message<span className="pn-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></p>
            <p className="pn-sub">Privacy check</p>
          </div>
        </div>
        <div className="pn-skeleton" aria-hidden="true"><span /><span /><span /></div>
      </>
    )
  }

  const { grade, gradeLabel, color, findings } = analysis

  // De-duplicate repeated terms (e.g. "Sam" mentioned twice).
  const seen = new Set()
  const items = findings.filter((f) => {
    const key = `${f.category}:${f.term.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return (
    <>
      <div className="pn-head">
        <span
          className={`pn-grade${showLetter ? '' : ' pn-grade--dot'}`}
          style={{ background: color }}
          aria-hidden="true"
        >{showLetter ? grade : null}</span>
        <div>
          <p className="pn-title">{gradeLabel}</p>
          <p className="pn-sub">{showLetter ? `Privacy grade ${grade}` : 'Privacy check'}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="pn-list">
          {items.map((f, i) => (
            <li key={i}>
              <span className="pn-dot" style={{ background: SEVERITY_COLOR[f.severity] }} />
              <span><span className="pn-term">“{f.term}”</span> <span className="pn-label">{f.label}</span></span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="pn-clean">No personal details detected.</p>
      )}

      <p className="pn-foot">
        Details like these — who you are, your health, work, or money — can add up
        to identify you. Nothing is sent until you choose to.
      </p>
    </>
  )
}
