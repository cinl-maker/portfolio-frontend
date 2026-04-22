import { useState, useEffect, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是AI助手，可以帮你总结项目、文档，或者回答技术问题。有什么我可以帮你的吗？' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || '抱歉，我暂时无法回答这个问题。' }])
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，AI服务暂时不可用。请确保后端服务器正在运行。' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { label: '总结我的项目经验', prompt: '请总结一下我展示的项目经验，包括技术栈和项目特点' },
    { label: '优化简历描述', prompt: '帮我优化简历中的项目描述，使其更具吸引力' },
    { label: '面试问题预测', prompt: '根据我的技术栈，预测一下可能的面试问题' },
    { label: '职业发展建议', prompt: '基于当前IT行业趋势，给我一些职业发展建议' }
  ]

  return (
    <div className="container page">
      <h1 style={{ marginBottom: '2rem' }}>🤖 AI 助手</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>快捷操作</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {quickActions.map(action => (
            <button
              key={action.label}
              className="btn btn-secondary"
              onClick={() => setInput(action.prompt)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <strong>{msg.role === 'user' ? '你' : 'AI'}: </strong>
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <em>思考中...</em>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入你的问题..."
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            发送
          </button>
        </form>
      </div>
    </div>
  )
}

export default AIAssistant
