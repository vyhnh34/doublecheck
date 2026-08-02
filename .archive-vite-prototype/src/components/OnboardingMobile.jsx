import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronRight, Check,
  ShieldCheck, MessageSquare, Globe, Zap,
} from 'lucide-react'
import { CATS, RULE_LABEL, INITIAL_RULES } from './onboardingData.js'

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth > 500
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 501px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

// ─── Shared primitives ───────────────────────────────────────────────────────

function Separator({ indent = 0 }) {
  return <div style={{ height: 1, marginLeft: indent, background: 'var(--border)' }} />
}

function GlassNav({ dark, hasBorder }) {
  return {
    background: dark ? 'rgba(0,0,0,0.78)' : 'rgba(242,242,247,0.78)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderBottom: hasBorder
      ? (dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(60,60,67,0.18)')
      : 'none',
  }
}

function IOSToggle({ on, onToggle, dark }) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'relative', flexShrink: 0,
        width: 51, height: 31, borderRadius: 16,
        background: on ? '#000000' : (dark ? 'rgba(255,255,255,0.18)' : 'rgba(120,120,128,0.32)'),
        transition: 'background 0.2s ease',
        border: 'none', cursor: 'pointer',
      }}
      aria-checked={on}
      role="switch"
    >
      <div style={{
        position: 'absolute', top: 2, left: on ? 22 : 2,
        width: 27, height: 27, borderRadius: '50%',
        background: dark && !on ? 'rgba(255,255,255,0.9)' : '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
        transition: 'left 0.2s ease',
      }} />
    </button>
  )
}

// ─── Bottom nav bar (all viewports) ─────────────────────────────────────────

function BottomBar({ onBack, backLabel = 'Back', onNext, nextLabel = 'Continue', dark, dotInfo }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
      paddingBottom: 20, paddingTop: 12,
      background: dark ? 'rgba(0,0,0,0.88)' : 'rgba(242,242,247,0.88)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderTop: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
    }}>
      {dotInfo && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
          {dotInfo.screens.map((s) => (
            <button key={s} onClick={() => dotInfo.onNav(s)} style={{
              width: dotInfo.current === s ? 24 : 8, height: 8, borderRadius: 4,
              background: dotInfo.current === s
                ? (dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)')
                : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)'),
              transition: 'width 0.2s ease',
              flexShrink: 0, border: 'none', cursor: 'pointer',
            }} />
          ))}
        </div>
      )}
      <div className="onboarding-inner" style={{ display: 'flex', gap: 12 }}>
        {onBack && (
          <button onClick={onBack} style={{
            flex: 1, height: 44, borderRadius: 9999,
            background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            color: dark ? '#ffffff' : '#000000',
            fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
          }}>{backLabel}</button>
        )}
        <button onClick={onNext} style={{
          flex: onBack ? 2 : 1, height: 44, borderRadius: 9999,
          background: dark ? '#ffffff' : '#000000',
          color: dark ? '#000000' : '#ffffff',
          fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>{nextLabel}</button>
      </div>
    </div>
  )
}

// ─── Rule dropdown options (Design A desktop) ────────────────────────────────

const RULE_DROPDOWN_OPTIONS = [
  { rule: 'ask',   label: 'Nudge me',        caption: 'Visually remind me every time' },
  { rule: 'share', label: 'No nudge', caption: 'No reminder needed'            },
]

// ─── Screen 2A — Design A: Chevron / rule-label list ────────────────────────

function Screen2A({ rules, onSelectCat, onSetRule, onContinue, onBack, dark, dotInfo }) {
  const [scrolled, setScrolled]     = useState(false)
  const [moreExpanded, setMoreExpanded] = useState(false)
  const [dropdownId, setDropdownId] = useState(null)
  const scrollRef = useRef(null)
  const isDesktop = useIsDesktop()

  const mainCats = CATS.filter((c) => c.main)
  const moreCats = CATS.filter((c) => !c.main)

  const DISPLAY_RULE = { ask: 'Nudge me', share: 'No nudge', never: 'No nudge' }

  const moreLabel = useMemo(() => {
    const vals = moreCats.map((c) => rules[c.id])
    const unique = [...new Set(vals)]
    if (unique.length === 1) return `all ${DISPLAY_RULE[unique[0]]}`
    const counts = {}
    vals.forEach((v) => { counts[v] = (counts[v] ?? 0) + 1 })
    return Object.entries(counts).map(([r, n]) => `${n} ${DISPLAY_RULE[r]}`).join(', ')
  }, [moreCats, rules])

  const sub  = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'
  const card = dark ? 'rgba(28,28,30,1)' : '#ffffff'
  const sep  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.18)'
  const dropBg = dark ? 'rgba(44,44,46,1)' : 'rgba(248,248,250,1)'

  const handleRowClick = (catId) => {
    if (isDesktop) {
      setDropdownId(dropdownId === catId ? null : catId)
    } else {
      onSelectCat(catId)
    }
  }

  const renderCatRow = (cat, first) => {
    const isOpen = dropdownId === cat.id
    return (
      <div key={cat.id}>
        {!first && <div style={{ height: 1, marginLeft: 52, background: sep }} />}
        <button
          onClick={() => handleRowClick(cat.id)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', textAlign: 'left',
            padding: '13px 12px 13px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
          }}>
          <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 9, flexShrink: 0 }}>
            <cat.Icon style={{ width: 19, height: 19, color: dark ? '#fff' : '#000' }} strokeWidth={1.5} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 500, lineHeight: '22px', letterSpacing: '-0.43px', color: dark ? '#fff' : '#000' }}>{cat.label}</div>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: '17px', color: sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.sub}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, paddingLeft: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '21px', color: sub, whiteSpace: 'nowrap' }}>{DISPLAY_RULE[rules[cat.id]]}</span>
            <ChevronRight style={{
              width: 15, height: 15, opacity: 0.45, color: dark ? '#fff' : '#000',
              transition: 'transform 0.18s ease',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }} strokeWidth={2} />
          </div>
        </button>
        {/* Inline dropdown on desktop */}
        {isDesktop && isOpen && (
          <div style={{ borderTop: `1px solid ${sep}`, background: dropBg }}>
            {RULE_DROPDOWN_OPTIONS.map((opt) => {
              const sel = rules[cat.id] === opt.rule
              return (
                <button key={opt.rule}
                  onClick={() => { onSetRule(cat.id, opt.rule); setDropdownId(null) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 16px 11px 52px',
                    background: sel ? (dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)') : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: sel ? 600 : 400, lineHeight: '20px', color: dark ? '#fff' : '#000' }}>{opt.label}</div>
                    <div style={{ fontSize: 12, lineHeight: '16px', color: sub, marginTop: 1 }}>{opt.caption}</div>
                  </div>
                  {sel && <Check style={{ width: 16, height: 16, color: dark ? '#fff' : '#000', flexShrink: 0 }} strokeWidth={2.5} />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-background">
      {/* Top nav — scrolled title only, no action buttons */}
      <div className="absolute top-0 left-0 right-0 z-10" style={{ paddingTop: 10, ...GlassNav({ dark, hasBorder: scrolled }) }}>
        <div className="onboarding-inner" style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence>
            {scrolled && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ fontSize: 17, fontWeight: 600, color: dark ? '#fff' : '#000' }}>
                Your privacy rules
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef}
        className="absolute inset-0 overflow-y-auto"
        style={{ paddingTop: 54, paddingBottom: 128 }}
        onScroll={() => setScrolled((scrollRef.current?.scrollTop ?? 0) > 20)}>
        <div className="onboarding-inner">
          <div style={{ paddingTop: 12, paddingBottom: 6 }}>
            <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: '42.5px', letterSpacing: '-0.11px', color: dark ? '#fff' : '#000' }}>
              Your privacy rules
            </h1>
            <p style={{ fontSize: 15, lineHeight: '20px', letterSpacing: '-0.23px', color: sub, marginTop: 6 }}>
              Your top matter most data categories.{' '}
              Everything else defaults as <span style={{ fontWeight: 500 }}>Nudge me</span>.
            </p>
          </div>
          <div style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden', background: card }}>
            {mainCats.map((cat, i) => renderCatRow(cat, i === 0))}
          </div>
          <div style={{ marginTop: 24, borderRadius: 10, overflow: 'hidden', background: card }}>
            <button
              style={{ width: '100%', display: 'flex', alignItems: 'center', textAlign: 'left', padding: '14px 12px 14px 16px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => setMoreExpanded((e) => !e)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 17, fontWeight: 600, lineHeight: '25.5px', letterSpacing: '-0.43px', color: dark ? '#fff' : '#000' }}>More categories </span>
                {!moreExpanded && <span style={{ fontSize: 14, fontWeight: 500, color: sub }}>{moreCats.length} · {moreLabel}</span>}
              </div>
              <ChevronRight style={{ width: 15, height: 15, flexShrink: 0, opacity: 0.45, color: dark ? '#fff' : '#000', transition: 'transform 0.2s', transform: moreExpanded ? 'rotate(90deg)' : 'rotate(0)' }} strokeWidth={2} />
            </button>
            <AnimatePresence>
              {moreExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }} style={{ overflow: 'hidden' }}>
                  {moreCats.map((cat) => renderCatRow(cat, false))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BottomBar onBack={onBack} onNext={onContinue} nextLabel="Done" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Screen 2B — Design B: Toggle + description expand ──────────────────────

function Screen2({ rules, onToggleRule, onContinue, onBack, dark, dotInfo }) {
  const [scrolled, setScrolled]         = useState(false)
  const [moreExpanded, setMoreExpanded] = useState(false)
  const [expanded, setExpanded]         = useState({})
  const scrollRef = useRef(null)
  const isDesktop = useIsDesktop()

  const mainCats = CATS.filter((c) => c.main)
  const moreCats = CATS.filter((c) => !c.main)

  const moreLabel = useMemo(() => {
    const vals = moreCats.map((c) => rules[c.id])
    const unique = [...new Set(vals)]
    if (unique.length === 1) return `all ${RULE_LABEL[unique[0]]}`
    const counts = {}
    vals.forEach((v) => { counts[v] = (counts[v] ?? 0) + 1 })
    return Object.entries(counts).map(([r, n]) => `${n} ${RULE_LABEL[r]}`).join(', ')
  }, [moreCats, rules])

  const sub  = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'
  const card = dark ? 'rgba(28,28,30,1)' : '#ffffff'
  const sep  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.18)'

  function CatRowToggle({ cat, hasSep }) {
    const isExp = !!expanded[cat.id]
    return (
      <div>
        {hasSep && <div style={{ height: 1, background: sep }} />}
        <div style={{ display: 'flex', alignItems: 'center', padding: '15px 16px' }}>
          <button
            style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => setExpanded((e) => ({ ...e, [cat.id]: !e[cat.id] }))}>
            <cat.Icon style={{ width: 22, height: 22, marginRight: 16, flexShrink: 0, color: dark ? '#fff' : '#000' }} strokeWidth={1.5} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, lineHeight: '22px', letterSpacing: '-0.43px', color: dark ? '#fff' : '#000' }}>{cat.label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, lineHeight: '17px', color: sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.sub}</div>
            </div>
          </button>
          <div style={{ paddingLeft: 12, flexShrink: 0 }}>
            <IOSToggle on={rules[cat.id] === 'ask'} onToggle={() => onToggleRule(cat.id)} dark={dark} />
          </div>
        </div>
        <AnimatePresence>
          {isExp && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }} style={{ overflow: 'hidden' }}>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingLeft: 54, paddingRight: 16, paddingTop: 1, paddingBottom: 13 }}>
                <p style={{ fontSize: 13, lineHeight: '18px', letterSpacing: '-0.076px', color: sub, paddingTop: 10 }}>{cat.detail}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-background">
      <div className="absolute top-0 left-0 right-0 z-10" style={{ paddingTop: 10, ...GlassNav({ dark, hasBorder: scrolled }) }}>
        <div className="onboarding-inner" style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence>
            {scrolled && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ fontSize: 17, fontWeight: 600, color: dark ? '#fff' : '#000' }}>
                Your data rules
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto"
        style={{ paddingTop: 54, paddingBottom: 128 }}
        onScroll={() => setScrolled((scrollRef.current?.scrollTop ?? 0) > 20)}>
        <div className="onboarding-inner">
          <div style={{ paddingTop: 12, paddingBottom: 6 }}>
            <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: '42.5px', letterSpacing: '-0.11px', color: dark ? '#fff' : '#000' }}>
              Your data rules
            </h1>
            <p style={{ fontSize: 15, lineHeight: '20px', letterSpacing: '-0.23px', color: sub, marginTop: 6 }}>
              Your top matter most data categories. Everything else defaults to Nudge me.
            </p>
          </div>
          <div style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden', background: card }}>
            {mainCats.map((cat, i) => <CatRowToggle key={cat.id} cat={cat} hasSep={i > 0} />)}
          </div>
          <div style={{ marginTop: 24, borderRadius: 10, overflow: 'hidden', background: card }}>
            <button
              style={{ width: '100%', display: 'flex', alignItems: 'center', textAlign: 'left', padding: '14px 12px 14px 16px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => setMoreExpanded((e) => !e)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 17, fontWeight: 600, lineHeight: '25.5px', letterSpacing: '-0.43px', color: dark ? '#fff' : '#000' }}>More categories </span>
                {!moreExpanded && <span style={{ fontSize: 14, fontWeight: 500, color: sub }}>{moreCats.length} · {moreLabel}</span>}
              </div>
              <ChevronRight style={{ width: 15, height: 15, flexShrink: 0, opacity: 0.45, color: dark ? '#fff' : '#000', transition: 'transform 0.2s', transform: moreExpanded ? 'rotate(90deg)' : 'rotate(0)' }} strokeWidth={2} />
            </button>
            <AnimatePresence>
              {moreExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }} style={{ overflow: 'hidden' }}>
                  {moreCats.map((cat) => <CatRowToggle key={cat.id} cat={cat} hasSep />)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BottomBar onBack={onBack} onNext={onContinue} nextLabel="Done" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Screen 3 — Never-share chip picker ─────────────────────────────────────

function Screen3NeverPicker({ rules, onToggle, onContinue, dark, dotInfo }) {
  const count = CATS.filter((c) => rules[c.id] === 'never').length
  const sub = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'

  return (
    <div className="absolute inset-0 bg-background" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 128 }}>
        <div className="onboarding-inner" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: '34px', letterSpacing: '-0.017px', color: dark ? '#fff' : '#000' }}>
            What data won&apos;t<br />you ever share?
          </h1>
          <p style={{ fontSize: 15, lineHeight: '20px', letterSpacing: '-0.23px', color: sub, marginTop: 10 }}>
            Select all that apply.<br />You can change this anytime.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
            {CATS.map((cat) => {
              const selected = rules[cat.id] === 'never'
              return (
                <button key={cat.id} onClick={() => onToggle(cat.id)}
                  style={{
                    height: 44,
                    paddingLeft: 17, paddingRight: 17,
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderRadius: 9999,
                    background: selected ? (dark ? '#ffffff' : '#000000') : (dark ? 'rgba(255,255,255,0.07)' : '#ffffff'),
                    border: `1.5px solid ${selected ? 'transparent' : (dark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.13)')}`,
                    color: selected ? (dark ? '#000000' : '#ffffff') : (dark ? '#ffffff' : '#000000'),
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}>
                  <cat.Icon style={{ width: 16, height: 16, flexShrink: 0 }} strokeWidth={1.8} />
                  <span style={{ fontSize: 15, fontWeight: 500, lineHeight: '15px', letterSpacing: '-0.23px', whiteSpace: 'nowrap' }}>{cat.label}</span>
                </button>
              )
            })}
          </div>
          {count > 0 && (
            <button
              style={{ fontSize: 13, color: sub, textDecoration: 'underline', textDecorationColor: 'rgba(108,108,112,0.4)', textUnderlineOffset: 2, marginTop: 24, background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => CATS.filter((c) => rules[c.id] === 'never').forEach((c) => onToggle(c.id))}>
              Clear
            </button>
          )}
        </div>
      </div>

      <BottomBar onBack={null} onNext={onContinue} nextLabel="Continue" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Category sheet (mobile only — desktop uses inline dropdown) ─────────────

function CategorySheet({ cat, rule, onSelect }) {
  const options = [
    { rule: 'ask',   label: 'Nudge me',        caption: 'Visually remind me every time' },
    { rule: 'share', label: 'No nudge', caption: 'No reminder needed'            },
  ]
  return (
    <div style={{ paddingTop: 16, paddingBottom: 40 }}>
      <div className="onboarding-inner">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ width: 36, height: 5, borderRadius: 9999, background: 'var(--foreground)', opacity: 0.2 }} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--foreground)', textAlign: 'center' }}>{cat.label}</h2>
        <p style={{ fontSize: 13, color: 'var(--muted-foreground)', textAlign: 'center', marginTop: 4, marginBottom: 24 }}>{cat.sub}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map((opt) => {
            const selected = rule === opt.rule
            return (
              <button key={opt.rule}
                style={{
                  width: '100%', borderRadius: 16, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: selected ? 'var(--foreground)' : 'transparent',
                  border: `1px solid ${selected ? 'var(--foreground)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onClick={() => onSelect(opt.rule)}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, lineHeight: '22px', color: selected ? 'var(--background)' : 'var(--foreground)' }}>{opt.label}</div>
                  <div style={{ fontSize: 13, lineHeight: '17px', marginTop: 2, color: selected ? 'var(--background)' : 'var(--muted-foreground)', opacity: selected ? 0.65 : 1 }}>{opt.caption}</div>
                </div>
                {selected && <Check style={{ width: 20, height: 20, flexShrink: 0, marginLeft: 16, color: 'var(--background)' }} strokeWidth={2.5} />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Screen 4 — Summary ──────────────────────────────────────────────────────

const MAX_SECTION_ITEMS = 4

function Screen4({ rules, onEdit, onContinue, dark, dotInfo }) {
  const [scrolled, setScrolled]             = useState(false)
  const [expandedSections, setExpandedSections] = useState({})
  const scrollRef = useRef(null)
  const isDesktop = useIsDesktop()

  const sections = [
    { rule: 'ask',   label: 'Nudge me'        },
    { rule: 'share', label: 'No nudge' },
  ]

  const byRule = useMemo(() => {
    const result = { never: [], ask: [], share: [] }
    CATS.forEach((c) => result[rules[c.id]].push(c))
    return result
  }, [rules])

  const sub  = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'
  const card = dark ? 'rgba(28,28,30,1)' : '#ffffff'
  const sep  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.18)'

  return (
    <div className="absolute inset-0 bg-background">
      {/* Scrolled title in top nav — invisible until user scrolls past title */}
      <div className="absolute top-0 left-0 right-0 z-10" style={{
        background: scrolled ? (dark ? 'rgba(0,0,0,0.78)' : 'rgba(242,242,247,0.78)') : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? (dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(60,60,67,0.18)') : 'none',
      }}>
        <div className="onboarding-inner" style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence>
            {scrolled && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ fontSize: 17, fontWeight: 600, color: dark ? '#fff' : '#000' }}>
                Your data rules
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto"
        style={{ paddingTop: 20, paddingBottom: 128 }}
        onScroll={() => setScrolled((scrollRef.current?.scrollTop ?? 0) > 56)}>
        <div className="onboarding-inner">
          <div style={{ paddingTop: 12, paddingBottom: 8 }}>
            <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.5px', color: dark ? '#fff' : '#000', lineHeight: 1.1 }}>Your data rules</h1>
          </div>

          {sections.filter((s) => byRule[s.rule].length > 0).map((s) => {
            const cats = byRule[s.rule]
            const isExp = !!expandedSections[s.rule]
            const hiddenCount = cats.length > MAX_SECTION_ITEMS ? cats.length - MAX_SECTION_ITEMS : 0
            const visible = (!isExp && hiddenCount > 0) ? cats.slice(0, MAX_SECTION_ITEMS) : cats

            return (
              <div key={s.rule} style={{ marginTop: 28 }}>
                <div style={{ paddingBottom: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                </div>
                <div style={{ borderRadius: 10, overflow: 'hidden', background: card }}>
                  {visible.map((cat, i) => (
                    <div key={cat.id}>
                      {i > 0 && <div style={{ height: 1, marginLeft: 52, background: sep }} />}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '15px 16px' }}>
                        <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 12 }}>
                          <cat.Icon style={{ width: 19, height: 19, color: dark ? '#fff' : '#000' }} strokeWidth={1.6} />
                        </div>
                        <span style={{ fontSize: 17, color: dark ? '#fff' : '#000' }}>{cat.label}</span>
                      </div>
                    </div>
                  ))}
                  {!isExp && hiddenCount > 0 && (
                    <div>
                      <div style={{ height: 1, marginLeft: 52, background: sep }} />
                      <button
                        onClick={() => setExpandedSections((e) => ({ ...e, [s.rule]: true }))}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '15px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <div style={{ width: 28, height: 28, flexShrink: 0, marginRight: 12 }} />
                        <span style={{ fontSize: 15, fontWeight: 500, color: sub }}>+{hiddenCount} more</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 13, lineHeight: '18px', color: sub }}>Change this anytime in Settings → Privacy</p>
          </div>

        </div>
      </div>

      <BottomBar onBack={onEdit} backLabel="Edit" onNext={onContinue} nextLabel="Looks good" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Screen 5 — Ready ────────────────────────────────────────────────────────

function Screen5({ dark, onDone, dotInfo }) {
  const areas = [
    { Icon: MessageSquare, title: 'AI conversations',  sub: 'ChatGPT, Claude, Gemini, Copilot'        },
    { Icon: Globe,         title: 'Internet browsing', sub: 'Search, news, social, shopping'          },
    { Icon: Zap,           title: 'Connected apps',    sub: 'Any app that calls an AI on your behalf' },
  ]
  const sep = dark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.18)'

  return (
    <div className="absolute inset-0 bg-background" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div className="onboarding-inner" style={{ paddingTop: 64, paddingBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
              <ShieldCheck style={{ width: 36, height: 36, color: dark ? '#fff' : '#000' }} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px', color: dark ? '#fff' : '#000', lineHeight: 1.1 }}>You&apos;re ready.</h1>
              <p style={{ fontSize: 16, lineHeight: '22px', color: dark ? 'rgba(235,235,245,0.6)' : '#6c6c70', marginTop: 8 }}>Your rules apply automatically across every AI interaction.</p>
            </div>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}>
              {areas.map(({ Icon, title, sub: areaSub }, i) => (
                <div key={title}>
                  {i > 0 && <div style={{ height: 1, marginLeft: 56, background: sep }} />}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '15px 16px', gap: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
                      <Icon style={{ width: 16, height: 16, color: dark ? '#fff' : '#000' }} strokeWidth={1.6} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: dark ? '#fff' : '#000', lineHeight: '20px' }}>{title}</div>
                      <div style={{ fontSize: 13, color: dark ? 'rgba(235,235,245,0.6)' : '#6c6c70', lineHeight: '17px' }}>{areaSub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, lineHeight: '18px', textAlign: 'center', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
              Always on. Runs silently in the background.
            </p>
          </div>
        </div>
      </div>

      <BottomBar onBack={null} onNext={onDone} nextLabel="Done" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function OnboardingMobile({ dark, s2variant }) {
  const [screen, setScreen] = useState(3)
  const [sheetId, setSheetId] = useState(null)
  const [rules, setRules] = useState(INITIAL_RULES)

  const sheetCat = CATS.find((c) => c.id === sheetId) ?? null
  const handleSelectRule = (rule) => { if (!sheetId) return; setRules((r) => ({ ...r, [sheetId]: rule })) }
  const handleSetRule = (catId, rule) => setRules((r) => ({ ...r, [catId]: rule }))
  const navTo = (s) => { setSheetId(null); setScreen(s) }
  const toggleNever = (id) => setRules((r) => ({ ...r, [id]: r[id] === 'never' ? 'ask' : 'never' }))
  const slide = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] } }
  const dotInfo = { screens: [3, 2, 4, 5], current: screen, onNav: navTo }

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <AnimatePresence mode="wait">
        {screen === 3 && <motion.div key="s3" {...slide} className="absolute inset-0"><Screen3NeverPicker rules={rules} onToggle={toggleNever} onContinue={() => navTo(2)} dark={dark} dotInfo={dotInfo} /></motion.div>}
        {screen === 2 && (
          <motion.div key={`s2-${s2variant}`} {...slide} className="absolute inset-0">
            {s2variant === 'A'
              ? <Screen2A rules={rules} onSelectCat={(id) => setSheetId(id)} onSetRule={handleSetRule} onContinue={() => navTo(4)} onBack={() => navTo(3)} dark={dark} dotInfo={dotInfo} />
              : <Screen2 rules={rules} onToggleRule={(id) => setRules((r) => ({ ...r, [id]: r[id] === 'ask' ? 'never' : 'ask' }))} onContinue={() => navTo(4)} onBack={() => navTo(3)} dark={dark} dotInfo={dotInfo} />
            }
          </motion.div>
        )}
        {screen === 4 && <motion.div key="s4" {...slide} className="absolute inset-0"><Screen4 rules={rules} onEdit={() => navTo(2)} onContinue={() => navTo(5)} dark={dark} dotInfo={dotInfo} /></motion.div>}
        {screen === 5 && <motion.div key="s5" {...slide} className="absolute inset-0"><Screen5 dark={dark} onDone={() => navTo(3)} dotInfo={dotInfo} /></motion.div>}
      </AnimatePresence>

      {/* Bottom sheet — mobile only (desktop uses inline dropdown) */}
      <AnimatePresence>
        {sheetId && sheetCat && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40" style={{ background: 'rgba(0,0,0,0.38)' }} onClick={() => setSheetId(null)} />
            <motion.div key="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 34, stiffness: 400, mass: 0.9 }}
              className="absolute bottom-0 left-0 right-0 z-50 overflow-hidden"
              style={{
                borderRadius: '20px 20px 0 0', maxHeight: '58%',
                background: dark ? 'rgba(28,28,30,0.93)' : 'rgba(248,248,250,0.93)',
                backdropFilter: 'blur(44px) saturate(180%)',
                WebkitBackdropFilter: 'blur(44px) saturate(180%)',
                borderTop: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
              }}>
              <CategorySheet cat={sheetCat} rule={rules[sheetCat.id]} onSelect={handleSelectRule} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
