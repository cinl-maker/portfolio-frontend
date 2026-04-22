import { useState } from 'react'

interface Document {
  id: number
  title: string
  content: string
  type: string
  createdAt: string
}

const initialDocs: Document[] = [
  {
    id: 1,
    title: '简历',
    content: '全栈开发工程师，5年经验...',
    type: 'resume',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: '技术博客笔记',
    content: '关于React性能优化的一些思考...',
    type: 'notes',
    createdAt: '2024-01-20'
  }
]

function Documents() {
  const [docs, setDocs] = useState<Document[]>(initialDocs)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', type: 'notes' })
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [aiSummary, setAiSummary] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newDoc: Document = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      type: formData.type,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setDocs([...docs, newDoc])
    setFormData({ title: '', content: '', type: 'notes' })
    setShowForm(false)
  }

  const summarizeDoc = async (doc: Document) => {
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'document',
          title: doc.title,
          content: doc.content
        })
      })
      const data = await response.json()
      setAiSummary(data.summary)
    } catch {
      setAiSummary('AI服务暂时不可用，请检查后端配置。')
    }
  }

  const deleteDoc = (id: number) => {
    setDocs(docs.filter(d => d.id !== id))
    if (selectedDoc?.id === id) setSelectedDoc(null)
  }

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'resume': return '📄'
      case 'notes': return '📝'
      case 'report': return '📊'
      default: return '📁'
    }
  }

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>文档管理</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 新建文档'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>创建新文档</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>文档标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>文档类型</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg)',
                  color: 'var(--text)'
                }}
              >
                <option value="notes">笔记</option>
                <option value="resume">简历</option>
                <option value="report">报告</option>
              </select>
            </div>
            <div className="form-group">
              <label>内容</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                style={{ minHeight: '200px' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">保存文档</button>
          </form>
        </div>
      )}

      {aiSummary && (
        <div className="card" style={{ background: 'var(--bg)' }}>
          <h3>🤖 AI文档总结</h3>
          <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{aiSummary}</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setAiSummary(null)}>
            关闭
          </button>
        </div>
      )}

      <div className="doc-list">
        {docs.map(doc => (
          <div key={doc.id} className="doc-item" style={{ cursor: 'pointer' }}>
            <span className="doc-icon">{getDocIcon(doc.type)}</span>
            <div className="doc-info" style={{ flex: 1 }}>
              <h4>{doc.title}</h4>
              <p>{doc.content.substring(0, 100)}...</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{doc.createdAt}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => summarizeDoc(doc)}>
                🤖 总结
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedDoc(doc)}>
                查看
              </button>
              <button className="btn btn-secondary" onClick={() => deleteDoc(doc.id)} style={{ color: '#ef4444' }}>
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoc && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>{selectedDoc.title}</h3>
            <button className="btn btn-secondary" onClick={() => setSelectedDoc(null)}>关闭</button>
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{selectedDoc.content}</p>
        </div>
      )}
    </div>
  )
}

export default Documents
