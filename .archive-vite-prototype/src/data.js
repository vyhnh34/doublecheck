// ─────────────────────────  Models (placeholder data)  ─────────────────────
export const CLAUDE_MODELS = [
  { id: 'opus-4-8',   name: 'Opus 4.8',   note: 'Most capable for complex work' },
  { id: 'sonnet-4-6', name: 'Sonnet 4.6', note: 'Smart, fast — everyday default' },
  { id: 'haiku-4-5',  name: 'Haiku 4.5',  note: 'Fastest for lightweight tasks' },
]

export const OPENAI_MODELS = [
  { id: 'gpt-5.5',      name: 'GPT-5.5',      note: 'Best for complex reasoning and coding', badge: 'Smartest' },
  { id: 'gpt-5.4',      name: 'GPT-5.4',      note: 'Strong everyday model for professional work', badge: 'Balanced' },
  { id: 'gpt-5.4-mini', name: 'GPT-5.4 mini', note: 'Faster model for lightweight work', badge: 'Fast' },
  { id: 'gpt-5.4-nano', name: 'GPT-5.4 nano', note: 'Smallest, lowest-latency option', badge: 'Quick' },
]

export const MODEL_GROUPS = {
  claude: CLAUDE_MODELS,
  chatgpt: OPENAI_MODELS,
}

export const DEFAULT_MODELS = {
  claude: 'sonnet-4-6',
  chatgpt: 'gpt-5.5',
}

export const DEFAULT_MODEL = DEFAULT_MODELS.claude

/*
  Simulated assistant reply — a scripted "interview coach" so the prototype can
  run a believable multi-round mock interview during user tests.
  ▸ `turn` is the participant's message number (1 = their first message).
  ▸ Each turn gives a bit of feedback, then asks the next question one at a
    time. The gap question (turn 2) is deliberately placed early to draw out
    the sensitive disclosure that the privacy check reacts to.
  ▸ Swap the body for a real fetch() to your API when you want it live.
*/
const COACH_TURNS = [
  // Turn 1 — settle nerves briefly, then go straight to the gap question so the
  // sensitive disclosure comes out on the participant's very next message.
  "Totally normal to feel nervous — that just means you care, and a résumé gap is easier to handle than you think. Let's tackle it head-on.\n\n" +
    "Pretend I just asked: “I see a gap in your timeline — can you walk me through it?” Answer me honestly, the way you would in the room.",
  // Turn 2 — coach the framing, then pivot to the project they're working on.
  "Thank you for being candid. Here's the reframe: name it in one calm sentence, then pivot fast to what you've been doing since and what you bring now — you don't owe anyone the private details.\n\n" +
    "Let's practice that pivot. Tell me about the project you're working on right now — what problem are you solving, and what's your role?",
  // Turn 3 — dig into the project so they elaborate.
  "Great — I can picture it, and that's exactly the kind of work to steer the conversation toward.\n\n" +
    "Go a level deeper for me: walk me through one tricky decision or tradeoff you made on it, and why you chose that way.",
]

const COACH_WRAP =
  "Nice — that's the confident, grounded tone to carry in. Quick read: strong reasoning; just end each answer with the outcome or what you learned.\n\n" +
  "And keep the gap to one unbothered sentence. You've got this. Want to run any answer again?"

export function respond(userText, { model, turn = 1 } = {}) {
  const reply = COACH_TURNS[turn - 1] ?? COACH_WRAP

  return new Promise((resolve) => {
    setTimeout(() => resolve(reply), 900)
  })
}
