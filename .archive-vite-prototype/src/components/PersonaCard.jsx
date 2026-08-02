import { useState } from 'react'

// ─────────────────────────  Persona card (testing aid)  ─────────────────────
// A collapsible prompt card pinned top-left, shown to user-test participants so
// they can role-play a persona while trying the composer. This is scaffolding
// for moderated sessions — safe to delete: remove this file, its import, and the
// <PersonaCard /> usage in App.jsx.

// Edit or add personas here. `intro` is the framing line; `facts` are the
// details a tester can weave in naturally; `goal` is what they're trying to do.
const PERSONA = {
  name: 'David',
  intro: "I'm switching careers into UX and I've landed an interview tomorrow. I'm a little nervous about a gap in my résumé and want to run a quick mock interview and get help explaining it.",
  facts: [
    'My name is David; I live in Seattle',
    'My interview is tomorrow afternoon',
    'The gap: I took about a year off — medical leave after surgery, and time caring for my mom',
    'Before the break I worked at Google, making around $95k',
    'Right now I’m building a portfolio project — redesigning a community library app so people can search, reserve, and pick up books more easily',
    'I want to list my old manager Sarah as a reference — sarah.m@gmail.com or 206-555-0142',
    'Feel free to paste in bits of my résumé if it helps',
  ],
  goal: 'Get the AI to help you prep. Just talk to it the way you actually would.',
}

export default function PersonaCard() {
  const [open, setOpen] = useState(false)

  return (
    <div className={`persona-card${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="persona-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="persona-dot" aria-hidden="true" />
        <span className="persona-toggle-label">Persona — {PERSONA.name}</span>
        <span className="persona-chevron" aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="persona-body">
          <p className="persona-heading">You are: {PERSONA.name}</p>
          <p className="persona-intro">{PERSONA.intro}</p>
          <ul className="persona-facts">
            {PERSONA.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <p className="persona-goal"><strong>Your goal:</strong> {PERSONA.goal}</p>
        </div>
      )}
    </div>
  )
}
