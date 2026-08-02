import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Greeting from './components/Greeting.jsx'
import Message from './components/Message.jsx'
import Composer from './components/Composer.jsx'
import PrivacyNudge from './components/PrivacyNudge.jsx'
import PrivacySheet from './components/PrivacySheet.jsx'
import ThemeControl from './components/ThemeControl.jsx'
import PersonaCard from './components/PersonaCard.jsx'
import OnboardingVersion from './components/OnboardingVersion.jsx'
import OnboardingV2Version from './components/OnboardingV2Version.jsx'
import { ChatGPTMark, Spark } from './components/icons.jsx'
import { DEFAULT_MODEL, DEFAULT_MODELS, MODEL_GROUPS, respond } from './data.js'
import { DEFAULT_VERSION } from './versions.js'

const AgentationTool = lazy(() => import('agentation').then((module) => ({ default: module.Agentation })))
const InterfaceKitTool = lazy(() => import('interface-kit/react').then((module) => ({ default: module.InterfaceKit })))

export default function App() {
  const [messages, setMessages] = useState([]) // { id, role, text|null }
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [productTheme, setProductTheme] = useState('claude')
  const [colorMode, setColorMode] = useState('light')
  const [tools, setTools] = useState({
    agentation: false,
    interfaceKit: false,
  })
  const [privacy, setPrivacy] = useState({ status: 'idle', analysis: null }) // debounced privacy state
  const [version, setVersion] = useState(DEFAULT_VERSION) // which interaction is active
  const [onboardingView, setOnboardingView] = useState('mobile')
  const [s2variant, setS2variant] = useState('A')
  const [detailsOpen, setDetailsOpen] = useState(false) // mobile privacy sheet
  // Privacy reminders kick in from the second round on: the first message has
  // little to secure, so we keep it clean and let the risk build with the
  // conversation. (Rounds = how many messages the participant has already sent.)
  const roundsSent = messages.filter((m) => m.role === 'user').length
  const privacyActive = roundsSent >= 1
  const privacyMode = !privacyActive
    ? 'off'
    : version === 'privacy-grade'
      ? 'grade'
      : version === 'privacy-color'
        ? 'color'
        : version === 'privacy-inline'
          ? 'inline'
          : 'off'
  const showPrivacySummary = privacyMode === 'grade' || privacyMode === 'color'
  const showLetter = privacyMode === 'grade'
  const mainRef = useRef(null)
  const idRef = useRef(0)

  const isConversation = messages.length > 0
  const nextId = () => ++idRef.current
  const productName = productTheme === 'chatgpt' ? 'ChatGPT' : 'Claude'
  const greetingText = productTheme === 'chatgpt' ? "What's on the agenda today?" : 'How can I help you today?'
  const placeholder = isConversation ? 'Reply...' : 'Message'
  const modelOptions = MODEL_GROUPS[productTheme]

  // Close the mobile details sheet once the draft (and its analysis) clears.
  useEffect(() => {
    if (privacy.status === 'idle' || !showPrivacySummary) setDetailsOpen(false)
  }, [privacy.status, showPrivacySummary])

  // Apply appearance settings to <html> so the CSS tokens switch.
  useEffect(() => {
    document.documentElement.setAttribute('data-product-theme', productTheme)
    document.documentElement.setAttribute('data-color-mode', colorMode)
  }, [productTheme, colorMode])

  useEffect(() => {
    if (!modelOptions.some((option) => option.id === model)) {
      setModel(DEFAULT_MODELS[productTheme])
    }
  }, [model, modelOptions, productTheme])

  // Keep the latest message in view.
  useEffect(() => {
    const el = mainRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function handleSend(text) {
    const typingId = nextId()
    // The participant's message number (1 = their first) drives the coach script.
    const turn = messages.filter((m) => m.role === 'user').length + 1
    // Add the user turn + an empty assistant turn (renders the typing dots).
    setMessages((m) => [
      ...m,
      { id: nextId(), role: 'user', text },
      { id: typingId, role: 'assistant', text: null },
    ])

    const modelName = modelOptions.find((m) => m.id === model)?.name
    const reply = await respond(text, { model: modelName, turn })

    // Replace the placeholder assistant turn with the real reply.
    setMessages((m) => m.map((msg) => (msg.id === typingId ? { ...msg, text: reply } : msg)))
  }

  function handleToolChange(tool, enabled) {
    setTools((current) => ({ ...current, [tool]: enabled }))
  }

  function copyAgentationOutput(output) {
    if (!output) return

    const textarea = document.createElement('textarea')
    textarea.value = output
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.appendChild(textarea)
    textarea.select()

    let copied = false
    try {
      copied = document.execCommand('copy')
    } finally {
      document.body.removeChild(textarea)
    }

    if (!copied && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(output).catch((error) => {
        console.warn('[agentation] copy failed', error)
      })
    }
  }

  return (
    <div className="app">
      {version === 'onboarding' ? (
        <OnboardingVersion view={onboardingView} dark={colorMode === 'dark'} s2variant={s2variant} />
      ) : version === 'onboarding-v2' ? (
        <OnboardingV2Version dark={colorMode === 'dark'} />
      ) : (
        <>
          <header className="topbar">
            <PersonaCard />
          </header>

          <main className="main" ref={mainRef}>
            <div className={`column${isConversation ? '' : ' is-empty'}`}>
              {!isConversation && <Greeting productTheme={productTheme} text={greetingText} />}

              {isConversation && (
                <section className="messages" aria-live="polite">
                  {messages.map((m) => (
                    <Message
                      key={m.id}
                      role={m.role}
                      text={m.text}
                      productTheme={productTheme}
                      productName={productName}
                    />
                  ))}
                </section>
              )}

              <div className={`composer-wrap${isConversation ? ' docked' : ''}`}>
                <Composer
                  model={model}
                  models={modelOptions}
                  onModelChange={setModel}
                  onSend={handleSend}
                  placeholder={placeholder}
                  productName={productName}
                  productTheme={productTheme}
                  privacyMode={privacyMode}
                  inlineVersion={version === 'privacy-inline'}
                  onPrivacyChange={setPrivacy}
                  onOpenDetails={() => setDetailsOpen(true)}
                  onAttach={() => console.log('[attach] open file picker')}
                />
                {!isConversation && (
                  <p className="hint">{productName} can make mistakes. This is a prototype - replies are simulated.</p>
                )}
              </div>
            </div>
          </main>

          {showPrivacySummary && <PrivacyNudge status={privacy.status} analysis={privacy.analysis} showLetter={showLetter} />}
          {showPrivacySummary && (
            <PrivacySheet
              open={detailsOpen}
              status={privacy.status}
              analysis={privacy.analysis}
              showLetter={showLetter}
              onClose={() => setDetailsOpen(false)}
            />
          )}
        </>
      )}

      <ThemeControl
        version={version}
        productTheme={productTheme}
        colorMode={colorMode}
        tools={tools}
        onboardingView={onboardingView}
        s2variant={s2variant}
        onVersionChange={setVersion}
        onProductThemeChange={setProductTheme}
        onColorModeChange={setColorMode}
        onToolChange={handleToolChange}
        onOnboardingViewChange={setOnboardingView}
        onS2variantChange={setS2variant}
      />

      <Suspense fallback={null}>
        {tools.agentation && <AgentationTool copyToClipboard={false} onCopy={copyAgentationOutput} />}
        {tools.interfaceKit && <InterfaceKitTool enabled />}
      </Suspense>
    </div>
  )
}
