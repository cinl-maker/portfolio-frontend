import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

interface Document {
  id: number
  title: string
  content?: string
  summary?: string
  file_type?: string
  type: string
  created_at?: string
  createdAt?: string
}

function Documents() {
  const [docs, setDocs] = useState<Document[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', type: 'notes' })
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 从后端加载文档
  useEffect(() => {
    fetch(`${API_BASE}/api/documents`)
      .then(res => res.json())
      .then(data => {
        setDocs(data.map((d: any) => ({
          ...d,
          type: d.file_type || 'notes',
          createdAt: d.created_at?.split('T')[0]
        })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // 保存到后端
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/api/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content
        })
      })
      const data = await res.json()
      if (data.id) {
        setDocs([{
          id: data.id,
          title: formData.title,
          content: formData.content,
          type: formData.type,
          createdAt: new Date().toISOString().split('T')[0]
        }, ...docs])
      }
    } catch {
      // API 失败时添加到本地
      setDocs([{
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        type: formData.type,
        createdAt: new Date().toISOString().split('T')[0]
      }, ...docs])
    }
    setFormData({ title: '', content: '', type: 'notes' })
    setShowForm(false)
  }

  // AI 总结
  const summarizeDoc = async (doc: Document) => {
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `请总结这个文档：${doc.title}，内容：${doc.content}`,
          context_type: 'document',
          context_id: doc.id
        })
      })
      const data = await res.json()
      setAiSummary(data.response)
    } catch {
      setAiSummary('AI服务暂时不可用。')
    }
  }

  // 删除文档
  const deleteDoc = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/documents/${id}`, { method: 'DELETE' })
    } catch {}
    setDocs(docs.filter(d => d.id !== id))
    if (selectedDoc?.id === id) setSelectedDoc(null)
  }

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'resume': return '📄'
      case 'notes': return '📝'
      case 'report': return '📊'
      case 'md': return '📝'
      case 'pdf': return '📕'
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

      {loading ? (
        <p>加载中...</p>
      ) : docs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>暂无文档，点击上方按钮创建</p>
        </div>
      ) : (
        <div className="doc-list">
          {docs.map(doc => (
            <div key={doc.id} className="doc-item" style={{ cursor: 'pointer' }}>
              <span className="doc-icon">{getDocIcon(doc.type)}</span>
              <div className="doc-info" style={{ flex: 1 }}>
                <h4>{doc.title}</h4>
                <p>{doc.content?.substring(0, 100)}...</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{doc.createdAt || doc.created_at}</p>
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
      )}

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
