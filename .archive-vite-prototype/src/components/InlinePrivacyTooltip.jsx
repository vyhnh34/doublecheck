import { ArrowCircleRight, ArrowUUpLeft } from '@phosphor-icons/react'

export default function InlinePrivacyTooltip({ label, anchor, secured = false, onAction }) {
  if (!label || !anchor) return null

  const ActionIcon = secured ? ArrowUUpLeft : ArrowCircleRight
  const actionLabel = secured ? 'Undo secured highlight' : `Secure highlighted ${label.toLowerCase()}`

  return (
    <div
      className={`inline-privacy-tooltip is-${anchor.placement}`}
      style={{ left: anchor.x, top: anchor.y }}
    >
      <span id="inline-privacy-tooltip" role="tooltip">{label}</span>
      <button
        type="button"
        className="inline-nudge-action"
        aria-label={actionLabel}
        title={secured ? 'Undo' : 'Secure'}
        onClick={onAction}
      >
        <ActionIcon aria-hidden="true" size={18} weight="fill" />
      </button>
    </div>
  )
}
