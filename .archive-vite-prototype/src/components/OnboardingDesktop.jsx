import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronRight, ChevronLeft, Check,
  ShieldCheck, MessageSquare, Globe, Zap, Hand, Network,
} from 'lucide-react'
import { CATS, RULE_LABEL, INITIAL_RULES } from './onboardingData.js'

// ─── Shared primitives ────────────────────────────────────────────────────────

function Separator({ indent = 0 }) {
  return <div style={{ height: 1, marginLeft: indent, background: 'var(--border)' }} />
}

function ShieldSparkleIcon({ className }) {
  return (
    <svg width="64" height="64" viewBox="0 0 72 72" fill="none" className={className} aria-hidden="true">
      <path d="M36 6L9 17.5v17C9 50 21 63.5 36 67 51 63.5 63 50 63 34.5v-17L36 6z" fill="currentColor" />
      <path d="M58.5 11l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" fill="currentColor" />
      <path d="M15 15l0.8 1.9 1.9 0.8-1.9 0.8-0.8 1.9-0.8-1.9-1.9-0.8 1.9-0.8z" fill="currentColor" />
      <circle cx="63" cy="26" r="2" fill="currentColor" />
      <circle cx="11" cy="28" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IOSToggle({ on, onToggle, dark }) {
  return (
    <button onClick={onToggle} role="switch" aria-checked={on}
      className="relative flex-shrink-0 transition-opacity hover:opacity-80"
      style={{
        width: 51, height: 31, borderRadius: 16,
        background: on ? '#000000' : dark ? 'rgba(255,255,255,0.18)' : 'rgba(120,120,128,0.32)',
        transition: 'background 0.2s ease',
      }}>
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

// ─── Progress indicator ───────────────────────────────────────────────────────

const STEP_LABELS = ['Intro', 'Never share', 'Categories', 'Summary', 'Ready']
const SCREEN_ORDER = [1, 3, 2, 4, 5]

function ProgressBar({ screen }) {
  const stepIndex = SCREEN_ORDER.indexOf(screen)
  return (
    <div className="flex items-center gap-2 px-8 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
      {STEP_LABELS.map((label, i) => {
        const done = i < stepIndex
        const active = i === stepIndex
        return (
          <div key={label} className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold"
                style={{
                  background: active ? 'var(--foreground)' : done ? 'var(--foreground)' : 'var(--border)',
                  color: (active || done) ? 'var(--background)' : 'var(--muted-foreground)',
                  opacity: done ? 0.5 : 1,
                }}>
                {done ? <Check strokeWidth={2.5} className="w-3 h-3" /> : i + 1}
              </div>
              <span className="text-[12px] font-medium hidden sm:block"
                style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)', opacity: done ? 0.5 : 1 }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="flex-1 h-px" style={{ background: done ? 'var(--foreground)' : 'var(--border)', opacity: done ? 0.3 : 1 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Desktop Screen 1 — Intro ─────────────────────────────────────────────────

function DeskScreen1({ onStart, onSkip }) {
  const features = [
    { Icon: ShieldCheck, text: 'Decide what gets shared, once' },
    { Icon: Network,     text: 'Works across every app, not just chat' },
    { Icon: Hand,        text: 'Change anything, anytime' },
  ]
  return (
    <div className="px-10 py-10">
      <div className="flex items-start gap-8">
        <ShieldSparkleIcon className="text-foreground flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h1 className="text-[32px] font-bold tracking-[-0.5px] text-foreground leading-tight mb-2">
            Your data, your rules
          </h1>
          <p className="text-[16px] leading-[24px] text-muted-foreground mb-8">
            Set your privacy preferences once, and they apply automatically across all AI interactions.
          </p>
          <div className="space-y-4 mb-10">
            {features.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--muted)' }}>
                  <Icon className="w-[17px] h-[17px] text-foreground" strokeWidth={1.7} />
                </div>
                <span className="text-[16px] leading-[22px] text-foreground">{text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="px-7 h-[48px] rounded-full bg-primary text-primary-foreground text-[15px] font-semibold transition-opacity hover:opacity-85"
              onClick={onStart}>
              Get started
            </button>
            <button className="px-7 h-[48px] text-[15px] text-muted-foreground transition-opacity hover:opacity-70"
              onClick={onSkip}>
              Skip — use recommended
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Desktop Screen 3 — Never-share ──────────────────────────────────────────

function DeskScreen3({ rules, onToggle, onContinue, onBack, dark }) {
  const count = CATS.filter((c) => rules[c.id] === 'never').length
  return (
    <div className="px-10 py-10">
      <h1 className="text-[28px] font-bold tracking-[-0.4px] text-foreground leading-tight mb-2">
        What data won&apos;t you ever share?
      </h1>
      <p className="text-[15px] leading-[22px] text-muted-foreground mb-7">
        Select all that apply. You can change this any time in Settings → Privacy.
      </p>
      <div className="flex flex-wrap gap-[10px] mb-7">
        {CATS.map((cat) => {
          const selected = rules[cat.id] === 'never'
          return (
            <button key={cat.id} onClick={() => onToggle(cat.id)}
              className="flex items-center gap-[7px] px-[16px] h-[42px] rounded-full transition-colors hover:opacity-80"
              style={{
                background: selected ? (dark ? '#ffffff' : '#000000') : (dark ? 'rgba(255,255,255,0.07)' : '#f5f5f7'),
                border: selected ? '1.5px solid transparent' : dark ? '1.5px solid rgba(255,255,255,0.13)' : '1.5px solid rgba(0,0,0,0.11)',
                color: selected ? (dark ? '#000000' : '#ffffff') : 'var(--foreground)',
              }}>
              <cat.Icon className="w-[15px] h-[15px] flex-shrink-0" strokeWidth={1.8} />
              <span className="text-[14px] font-medium leading-none">{cat.label}</span>
            </button>
          )
        })}
      </div>
      {count > 0 && (
        <button className="text-[13px] text-muted-foreground mb-8 transition-opacity hover:opacity-70"
          style={{ textDecoration: 'underline', textDecorationColor: 'rgba(0,0,0,0.2)', textUnderlineOffset: 2 }}
          onClick={() => CATS.filter((c) => rules[c.id] === 'never').forEach((c) => onToggle(c.id))}>
          Clear selection
        </button>
      )}
      <div className="flex gap-3 mt-2">
        <button className="h-[44px] px-5 rounded-full flex items-center gap-2 text-[14px] font-medium text-muted-foreground transition-opacity hover:opacity-70"
          style={{ border: '1px solid var(--border)' }} onClick={onBack}>
          <ChevronLeft className="w-4 h-4" strokeWidth={2} /> Back
        </button>
        <button className="h-[44px] px-7 rounded-full bg-primary text-primary-foreground text-[14px] font-semibold transition-opacity hover:opacity-85"
          onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}

// ─── Desktop Screen 2 — Categories (inline toggle) ───────────────────────────

function DeskScreen2({ rules, onToggleRule, onContinue, dark }) {
  const [moreExpanded, setMoreExpanded] = useState(false)
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

  return (
    <div className="px-10 py-8">
      <h1 className="text-[28px] font-bold tracking-[-0.4px] text-foreground leading-tight mb-1">Your data rules</h1>
      <p className="text-[15px] leading-[22px] text-muted-foreground mb-6">
        Toggle nudges for each category. You can always change these later.
      </p>
      <div className="rounded-[12px] overflow-hidden mb-3" style={{ border: '1px solid var(--border)' }}>
        {mainCats.map((cat, i) => (
          <div key={cat.id}>
            {i > 0 && <Separator indent={56} />}
            <div className="flex items-center py-4 px-5">
              <div className="w-8 h-8 rounded-[9px] flex items-center justify-center mr-4 flex-shrink-0"
                style={{ background: 'var(--muted)' }}>
                <cat.Icon className="w-[17px] h-[17px] text-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-foreground">{cat.label}</div>
                <div className="text-[13px] text-muted-foreground">{cat.sub}</div>
              </div>
              <IOSToggle on={rules[cat.id] === 'ask'} onToggle={() => onToggleRule(cat.id)} dark={dark} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] overflow-hidden mb-7" style={{ border: '1px solid var(--border)' }}>
        <button className="w-full flex items-center py-4 px-5 text-left hover:bg-muted transition-colors"
          onClick={() => setMoreExpanded((e) => !e)}>
          <div className="flex-1">
            <span className="text-[15px] font-semibold text-foreground">More categories</span>
            {!moreExpanded && <span className="text-[13px] text-muted-foreground ml-2">{moreCats.length} · {moreLabel}</span>}
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200"
            style={{ transform: moreExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }} strokeWidth={2} />
        </button>
        <AnimatePresence>
          {moreExpanded && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }} style={{ overflow: 'hidden' }}>
              {moreCats.map((cat, i) => (
                <div key={cat.id}>
                  <Separator indent={56} />
                  <div className="flex items-center py-4 px-5">
                    <div className="w-8 h-8 rounded-[9px] flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ background: 'var(--muted)' }}>
                      <cat.Icon className="w-[17px] h-[17px] text-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-semibold text-foreground">{cat.label}</div>
                      <div className="text-[13px] text-muted-foreground">{cat.sub}</div>
                    </div>
                    <IOSToggle on={rules[cat.id] === 'ask'} onToggle={() => onToggleRule(cat.id)} dark={dark} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button className="h-[48px] px-8 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold transition-opacity hover:opacity-85"
        onClick={onContinue}>
        Continue
      </button>
    </div>
  )
}

// ─── Desktop Screen 4 — Summary ──────────────────────────────────────────────

function DeskScreen4({ rules, onEdit, onContinue }) {
  const sections = [
    { rule: 'never', label: 'Not nudging'         },
    { rule: 'ask',   label: 'Nudge me'            },
    { rule: 'share', label: 'Share automatically' },
  ]
  const byRule = useMemo(() => {
    const result = { never: [], ask: [], share: [] }
    CATS.forEach((c) => result[rules[c.id]].push(c))
    return result
  }, [rules])

  return (
    <div className="px-10 py-8">
      <h1 className="text-[28px] font-bold tracking-[-0.4px] text-foreground leading-tight mb-1">Your data rules</h1>
      <p className="text-[13px] text-muted-foreground mb-6">Change this anytime in Settings → Privacy</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {sections.filter((s) => byRule[s.rule].length > 0).map((s) => (
          <div key={s.rule} className="rounded-[12px] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <div>
              {byRule[s.rule].map((cat, i) => (
                <div key={cat.id}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center py-3 px-4 gap-3">
                    <cat.Icon className="w-[16px] h-[16px] text-foreground flex-shrink-0" strokeWidth={1.6} />
                    <span className="text-[14px] text-foreground">{cat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="h-[48px] px-8 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold transition-opacity hover:opacity-85"
          onClick={onContinue}>
          Looks good
        </button>
        <button className="h-[48px] px-6 rounded-full text-[15px] font-medium text-foreground transition-opacity hover:opacity-70"
          style={{ border: '1px solid var(--border)' }} onClick={onEdit}>
          Edit
        </button>
      </div>
    </div>
  )
}

// ─── Desktop Screen 5 — Ready ────────────────────────────────────────────────

function DeskScreen5({ dark, onDone }) {
  const areas = [
    { Icon: MessageSquare, title: 'AI conversations',  sub: 'ChatGPT, Claude, Gemini, Copilot'        },
    { Icon: Globe,         title: 'Internet browsing', sub: 'Search, news, social, shopping'           },
    { Icon: Zap,           title: 'Connected apps',    sub: 'Any app that calls an AI on your behalf'  },
  ]
  return (
    <div className="px-10 py-10">
      <div className="flex items-start gap-8">
        <div className="w-[64px] h-[64px] rounded-[18px] flex items-center justify-center flex-shrink-0"
          style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
          <ShieldCheck className="w-[32px] h-[32px] text-foreground" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h1 className="text-[30px] font-bold tracking-[-0.4px] text-foreground leading-tight mb-2">You&apos;re ready.</h1>
          <p className="text-[16px] leading-[24px] text-muted-foreground mb-7">
            Your rules apply automatically across every AI interaction.
          </p>
          <div className="rounded-[12px] overflow-hidden mb-7" style={{ border: '1px solid var(--border)' }}>
            {areas.map(({ Icon, title, sub }, i) => (
              <div key={title}>
                {i > 0 && <Separator indent={56} />}
                <div className="flex items-center px-5 py-4 gap-4">
                  <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
                    style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
                    <Icon className="w-[16px] h-[16px] text-foreground" strokeWidth={1.6} />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-foreground">{title}</div>
                    <div className="text-[13px] text-muted-foreground">{sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-center mb-6" style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
            Always on. Runs silently in the background.
          </p>
          <button className="w-full h-[48px] rounded-full bg-primary text-primary-foreground text-[15px] font-semibold transition-opacity hover:opacity-85"
            onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function OnboardingDesktop({ dark }) {
  const [screen, setScreen] = useState(1)
  const [rules, setRules] = useState(INITIAL_RULES)

  const navTo = (s) => setScreen(s)
  const toggleNever = (id) => setRules((r) => ({ ...r, [id]: r[id] === 'never' ? 'ask' : 'never' }))
  const toggleRule  = (id) => setRules((r) => ({ ...r, [id]: r[id] === 'ask'   ? 'never' : 'ask' }))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-background"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>

      {/* Card */}
      <div className="w-full max-w-[680px] bg-card rounded-[20px] overflow-hidden"
        style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)' }}>
        <ProgressBar screen={screen} />

        <AnimatePresence mode="wait">
          {screen === 1 && (
            <motion.div key="d1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}>
              <DeskScreen1 onStart={() => navTo(3)} onSkip={() => navTo(4)} />
            </motion.div>
          )}
          {screen === 3 && (
            <motion.div key="d3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}>
              <DeskScreen3 rules={rules} onToggle={toggleNever} onContinue={() => navTo(2)} onBack={() => navTo(1)} dark={dark} />
            </motion.div>
          )}
          {screen === 2 && (
            <motion.div key="d2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}>
              <DeskScreen2 rules={rules} onToggleRule={toggleRule} onContinue={() => navTo(4)} dark={dark} />
            </motion.div>
          )}
          {screen === 4 && (
            <motion.div key="d4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}>
              <DeskScreen4 rules={rules} onEdit={() => navTo(2)} onContinue={() => navTo(5)} />
            </motion.div>
          )}
          {screen === 5 && (
            <motion.div key="d5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}>
              <DeskScreen5 dark={dark} onDone={() => navTo(1)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-5 text-[12px]" style={{ color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}>
        Desktop view · use progress steps to navigate
      </p>
    </div>
  )
}
