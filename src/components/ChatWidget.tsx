import React, { useEffect, useMemo, useRef, useState } from 'react'

// Lightweight chat widget
// - Floating circular button bottom-left
// - Minimal glassy chat panel inspired by the provided design
// - Pluggable API via environment variables or props

export type ChatWidgetProps = {
  apiUrl?: string
  apiKey?: string
  title?: string
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const defaultSystemGreeting = "Hello! How can I help you today?"

const ChatWidget: React.FC<ChatWidgetProps> = ({ apiUrl, apiKey, title }) => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'greet', role: 'assistant', content: defaultSystemGreeting },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  // --- Lightweight Markdown rendering (safe-escaped) ---
  function escapeHtml(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
  function mdToHtml(md: string) {
    // Preserve code blocks first
    const codeblocks: string[] = []
    let i = 0
    md = md.replace(/```([\s\S]*?)```/g, (_, code) => {
      const token = `__CODEBLOCK_${i++}__`
      codeblocks.push(`<pre class="md-code"><code>${escapeHtml(code.trim())}</code></pre>`) 
      return token
    })

    // Escape the rest
    let html = escapeHtml(md)

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>')

    // Bold and italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

    // Lists (simple)
    const lines = html.split(/\r?\n/)
    const out: string[] = []
    let inUl = false
    let inOl = false
    for (const line of lines) {
      if (/^\s*[-*]\s+/.test(line)) {
        if (!inUl) { out.push('<ul class="md-list">'); inUl = true }
        out.push(`<li>${line.replace(/^\s*[-*]\s+/, '')}</li>`) 
        continue
      }
      if (/^\s*\d+\.\s+/.test(line)) {
        if (!inOl) { out.push('<ol class="md-list">'); inOl = true }
        out.push(`<li>${line.replace(/^\s*\d+\.\s+/, '')}</li>`) 
        continue
      }
      if (inUl) { out.push('</ul>'); inUl = false }
      if (inOl) { out.push('</ol>'); inOl = false }
      if (line.trim().length) out.push(`<p>${line}</p>`) 
    }
    if (inUl) out.push('</ul>')
    if (inOl) out.push('</ol>')

    html = out.join('\n') || html

    // Restore code blocks
    html = html.replace(/__CODEBLOCK_(\d+)__/g, (_, idx) => codeblocks[Number(idx)] || '')

    return html
  }

  const cfg = useMemo(() => {
    return {
      apiUrl: apiUrl || (import.meta as any).env?.VITE_AI_API_URL || '',
      apiKey: apiKey || (import.meta as any).env?.VITE_AI_API_KEY || '',
      geminiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY || '',
      geminiModel: (import.meta as any).env?.VITE_GEMINI_MODEL || 'gemini-1.5-flash',
    }
  }, [apiUrl, apiKey])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [open, messages])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function resetChat() {
    setMessages([{ id: 'greet', role: 'assistant', content: defaultSystemGreeting }])
    setInput('')
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault()
    const text = input.trim()
    if (!text) return

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      let assistantText = ''

      if (cfg.apiUrl && cfg.apiKey) {
        // Generic POST format. Adjust backend contract as needed.
        const res = await fetch(cfg.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cfg.apiKey}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          }),
        })
        if (!res.ok) throw new Error(`Chat API error: ${res.status}`)
        const data = await res.json()
        // Expecting data.reply or data.choices[0].message.content
        assistantText = data.reply ?? data?.choices?.[0]?.message?.content ?? 'Okay.'
      } else if (cfg.geminiKey) {
        // Google Generative Language API (Gemini) REST
        const model = cfg.geminiModel
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cfg.geminiKey}`

        // Map messages to Gemini "contents"
        const contents = messages
          .concat(userMsg)
          .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        })
        if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
        const data = await res.json()
        assistantText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Okay.'
      } else {
        // Fallback echo for local dev without API key
        assistantText = "(demo) You said: " + text
      }

      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: assistantText }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err: any) {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I could not reach the chat service. Configure VITE_AI_API_URL and VITE_AI_API_KEY.',
      }
      setMessages(prev => [...prev, assistantMsg])
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <>
      {/* Floating circular trigger button (bottom-left) */}
      <button
        type="button"
        aria-label={`Open AI chat${title ? ' - ' + title : ''}`}
        className="chat-fab"
        onClick={() => setOpen(true)}
        ref={fabRef}
      >
        <span className="sr-only">Open chat</span>
        <div className="chat-fab-core">
          {/* Animated chat icon */}
          <svg className="chat-fab-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M7 8h10M7 12h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M21 12c0 3.866-3.806 7-8.5 7-.98 0-1.92-.12-2.8-.34-.28-.07-.58-.02-.83.13L5 20.5l.9-2.24c.12-.3.08-.63-.12-.88A6.77 6.77 0 0 1 3 12C3 8.134 6.806 5 11.5 5S21 8.134 21 12Z" stroke="white" strokeWidth="2" fill="currentColor"/>
          </svg>
        </div>
      </button>

      {/* Overlay + panel */}
      {open && (
        <div
          className="chat-overlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // Close when clicking outside the panel
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
              setOpen(false)
            }
          }}
        >
          <div className="chat-panel" ref={panelRef}>
            {/* Close chip */}
            <div className="chat-close-chip-wrap">
              <button className="chat-close-chip" onClick={() => setOpen(false)} aria-label="Close chat">
                <span aria-hidden>×</span>
              </button>
            </div>

            {/* Top header block */}
            <div className="chat-header-block">
              <button
                type="button"
                className="chat-new-btn"
                onClick={resetChat}
                aria-label="Start a new chat"
                title="Start a new chat"
              >
                <svg className="icon-new" viewBox="0 0 24 24" aria-hidden>
                  <rect x="4" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M7 7h8M7 10h8M7 13h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M14.8 15.8l4.1-4.1c.7-.7 1.8-.7 2.5 0 .7.7.7 1.8 0 2.5l-4.1 4.1-3.2.6.7-3.1z" fill="currentColor" />
                </svg>
              </button>
              <div className="chat-header-title">
                <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">Cheque</span>
                <span className="text-neutral-900 dark:text-neutral-100">Craft</span>
              </div>
            </div>

            {/* Framed middle content area */}
            <div className="chat-body-frame">
              <div className="chat-body" ref={listRef}>
                {messages.map(m => (
                  m.role === 'assistant' ? (
                    m.id === 'greet' ? (
                      // Custom hero-styled greeting inspired by the provided design
                      <div key={m.id} className="chat-bubble chat-greet" role="status" aria-label="Greeting">
                        <div className="hello">Hello</div>
                        <div className="main">How can I help you today?</div>
                        <p className="sub">is simply dummy text of the printing and typesetting industry. Lorem Ipsum</p>
                      </div>
                    ) : (
                      <div key={m.id} className="chat-bubble assistant">
                        <div className="chat-md" dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }} />
                      </div>
                    )
                  ) : (
                    <div key={m.id} className="chat-bubble user">{m.content}</div>
                  )
                ))}
                {loading && (
                  <div className="chat-bubble assistant"><div className="chat-md"><em>Typing…</em></div></div>
                )}
              </div>
            </div>

            {/* Input */}
            <form className="chat-input" onSubmit={sendMessage}>
              <div className="chat-input-wrap">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Write down instead…"
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  className={`chat-send-inline${loading ? ' is-loading' : ''}`}
                  disabled={loading || !input.trim()}
                  aria-label={loading ? 'AI is typing' : 'Send message'}
                  title={loading ? 'AI is typing' : 'Send message'}
                >
                  {loading ? (
                    <svg className="gpt-square" viewBox="0 0 16 16" aria-hidden>
                      <rect x="1" y="1" width="14" height="14" rx="3" fill="currentColor"/>
                      {/* simple knot hint */}
                      <path d="M5 8c0-1.657 1.343-3 3-3m3 3c0 1.657-1.343 3-3 3m-3 0c1.657 0 3-1.343 3-3m0 0c0-1.657-1.343-3-3-3" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  ) : (
                    <span aria-hidden>➤</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget
