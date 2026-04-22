import { useState, useEffect, useRef } from 'react'
import { storage } from '../api/storage'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是AI助手，可以帮你：\n• 总结项目经验\n• 优化简历描述\n• 预测面试问题\n• 提供职业建议\n\n有什么我可以帮你的吗？' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateAIResponse = (userMessage: string) => {
    const msg = userMessage.toLowerCase()
    
    if (msg.includes('项目') || msg.includes('总结')) {
      const projects = storage.getProjects()
      if (projects.length > 0) {
        const summary = projects.map(p => 
          `• ${p.title}: ${p.description} (${p.tech.join(', ')})`
        ).join('\n')
        return `📊 你的项目经验：\n\n${summary}\n\n💡 建议：可以突出项目的技术难点和业务价值，展示具体的成果指标。`
      }
      return '你还没有添加项目，可以在"项目作品"页面添加后，我帮你总结分析。'
    }
    
    if (msg.includes('简历') || msg.includes('优化')) {
      return `📝 简历优化建议：\n\n1. 使用 STAR 法则描述项目（情境、任务、行动、结果）\n2. 量化成果：如"性能提升 50%"、"用户增长 200%"\n3. 突出技术栈与岗位的匹配度\n4. 保持简洁，控制在 1-2 页\n\n需要我帮你优化具体的简历内容吗？`
    }
    
    if (msg.includes('面试')) {
      return `🎯 常见面试问题预测：\n\n**技术面：**\n• 自我介绍\n• 项目中最有挑战的部分\n• 技术选型的原因\n• 如何解决技术难题\n\n**HR面：**\n• 为什么离职\n• 职业规划\n• 期望薪资\n• 优势/劣势\n\n需要我模拟某个问题的回答吗？`
    }
    
    if (msg.includes('职业') || msg.includes('发展')) {
      return `🚀 职业发展建议：\n\n**技术路线：**\n• 深入专精某一领域（如前端/后端/架构）\n• 持续学习新技术，保持竞争力\n\n**管理路线：**\n• 提升沟通协调能力\n• 培养团队管理经验\n\n**趋势建议：**\n• AI/ML 技能越来越重要\n• 全栈能力是趋势\n• 开源贡献提升个人品牌\n\n有什么具体方向想深入聊吗？`
    }
    
    return `收到你的问题：${userMessage}\n\n💡 提示：可以问我关于"项目总结"、"简历优化"、"面试准备"、"职业发展"等话题，我会给你专业建议！`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    
    // 添加用户消息
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    // 模拟 AI 思考
    setTimeout(() => {
      const response = generateAIResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    }, 500)
  }

  const quickActions = [
    { label: '📊 总结项目经验', prompt: '总结我的项目经验' },
    { label: '📝 优化简历', prompt: '如何优化简历描述' },
    { label: '🎯 面试预测', prompt: '预测可能的面试问题' },
    { label: '🚀 职业建议', prompt: '给我职业发展建议' }
  ]

  return (
    <div className="container page">
      <h1 style={{ marginBottom: '1.5rem' }}>🤖 AI 助手</h1>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {quickActions.map(action => (
          <button
            key={action.label}
            className="btn btn-secondary"
            onClick={() => setInput(action.prompt)}
            style={{ fontSize: '0.85rem' }}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', minHeight: '400px' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg)',
                color: msg.role === 'user' ? 'white' : 'var(--text)',
                whiteSpace: 'pre-wrap'
              }}
            >
              <strong>{msg.role === 'user' ? '你' : 'AI'}: </strong>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入你的问题..."
            style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text)' }}
          />
          <button type="submit" className="btn btn-primary">发送</button>
        </form>
      </div>
    </div>
  )
}

export default AIAssistant
