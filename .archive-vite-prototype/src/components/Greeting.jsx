import { ChatGPTMark, Spark } from './icons.jsx'

// The "new chat" welcome: spark logo + serif greeting.
export default function Greeting({ productTheme = 'claude', text = 'How can I help you today?' }) {
  const Mark = productTheme === 'chatgpt' ? ChatGPTMark : Spark

  return (
    <section className="greeting">
      <Mark className="spark-lg" />
      <h1>{text}</h1>
    </section>
  )
}
