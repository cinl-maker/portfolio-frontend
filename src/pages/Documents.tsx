import { useState, useEffect } from 'react'
import { storage } from '../api/storage'

interface Document {
  id: number
  title: string
  content: string
  type: string
  created_at: string
}

function Documents() {
  const [docs, setDocs] = useState<Document[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', type: 'notes' })
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  useEffect(() => {
    storage.getDocuments().then(d => setDocs(d))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const doc = await storage.addDocument(formData)
    setDocs([doc, ...docs])
    setFormData({ title: '', content: '', type: 'notes' })
    setShowForm(false)
  }

  const deleteDoc = async (id: number) => {
    await storage.deleteDocument(id)
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
        <h1>📄 文档管理</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => storage.exportData()}>📤 导出</button>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            📥 导入
            <input type="file" accept=".json" onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                storage.importData(file).then(() => {
                  storage.getDocuments().then(d => setDocs(d))
                  alert('导入成功！')
                }).catch(err => alert(err.message))
              }
            }} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '取消' : '+ 新建'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>创建文档</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>类型</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text)' }}
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
                rows={5}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">保存</button>
          </form>
        </div>
      )}

      <div className="doc-list">
        {docs.map(doc => (
          <div key={doc.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{getDocIcon(doc.type)}</span>
            <div style={{ flex: 1 }}>
              <h4>{doc.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {doc.content.substring(0, 80)}...
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedDoc(doc)}>查看</button>
              <button className="btn btn-secondary" style={{ color: '#ef4444' }} onClick={() => deleteDoc(doc.id)}>删除</button>
            </div>
          </div>
        ))}
      </div>

      {docs.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>暂无文档，支持导入/导出备份</p>
        </div>
      )}

      {selectedDoc && (
        <div className="card" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', zIndex: 1000, background: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{selectedDoc.title}</h3>
            <button className="btn btn-secondary" onClick={() => setSelectedDoc(null)}>关闭</button>
          </div>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{selectedDoc.content}</p>
        </div>
      )}
    </div>
  )
}

export default Documents
