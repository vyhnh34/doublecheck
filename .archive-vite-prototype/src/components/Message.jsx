import { ChatGPTMark, Spark } from './icons.jsx'

// A single chat turn. role: 'user' | 'assistant'.
// When an assistant message has no text yet, it renders the typing indicator.
export default function Message({ role, text, productTheme = 'claude', productName = 'Claude' }) {
  const Mark = productTheme === 'chatgpt' ? ChatGPTMark : Spark

  if (role === 'user') {
    return (
      <div className="msg user">
        <div className="bubble">{text}</div>
      </div>
    )
  }

  return (
    <div className="msg assistant">
      <div className="avatar"><Mark /></div>
      <div className="body">
        {text ?? (
          <span className="typing" aria-label={`${productName} is typing`}>
            <span /><span /><span />
          </span>
        )}
      </div>
    </div>
  )
}
