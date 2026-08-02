// Small inline SVG icon set — dependency-free, inherits currentColor.

export function Spark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="var(--accent)"
        d="M12 1.5c.5 0 .9.4.9.9l.35 6.1 1.2-1.2a.9.9 0 0 1 1.3 1.3l-1.2 1.2 6.1.35a.9.9 0 0 1 0 1.8l-6.1.35 1.2 1.2a.9.9 0 0 1-1.3 1.3l-1.2-1.2-.35 6.1a.9.9 0 0 1-1.8 0l-.35-6.1-1.2 1.2a.9.9 0 0 1-1.3-1.3l1.2-1.2-6.1-.35a.9.9 0 0 1 0-1.8l6.1-.35-1.2-1.2a.9.9 0 0 1 1.3-1.3l1.2 1.2.35-6.1c0-.5.4-.9.9-.9z"
      />
    </svg>
  )
}

export function ChatGPTMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.8 4.2a4.2 4.2 0 0 1 6.6 2.9" />
        <path d="M15.2 4.2a4.2 4.2 0 0 1 1.5 6.5" />
        <path d="M19 9a4.2 4.2 0 0 1-4.9 5.2" />
        <path d="M15.2 19.8a4.2 4.2 0 0 1-6.6-2.9" />
        <path d="M8.8 19.8a4.2 4.2 0 0 1-1.5-6.5" />
        <path d="M5 15a4.2 4.2 0 0 1 4.9-5.2" />
        <path d="M9.9 9.8 14.1 12l-4.2 2.2V9.8z" />
      </g>
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Sun = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const Moon = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M20.8 14.6A8.6 8.6 0 0 1 9.4 3.2 8.6 8.6 0 1 0 20.8 14.6z" />
  </svg>
)

export const Settings = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1z" />
  </svg>
)

export const Plus = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}><path d="M12 5v14M5 12h14" /></svg>
)

export const Tools = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M4 6h11M4 12h7M4 18h13" />
    <circle cx="19" cy="6" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="20" cy="18" r="2" />
  </svg>
)

export const Chevron = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}><path d="M6 9l6 6 6-6" /></svg>
)

export const ArrowUp = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2.2" {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
)

export const Check = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2.5" {...p}><path d="M20 6L9 17l-5-5" /></svg>
)
