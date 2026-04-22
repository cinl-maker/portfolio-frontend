import { useState, useEffect } from 'react'
import { storage } from '../api/storage'

interface Project {
  id: number
  title: string
  description: string
  tech: string[]
  status: string
  github_url?: string
  demo_url?: string
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', tech: '' })
  const [aiSummary, setAiSummary] = useState<string | null>(null)

  useEffect(() => {
    storage.getProjects().then(p => setProjects(p))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newProject: Project = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      tech: formData.tech.split(',').map(t => t.trim()),
      status: '规划中'
    }
    await storage.addProject(newProject)
    setProjects([...projects, newProject])
    setFormData({ title: '', description: '', tech: '' })
    setShowForm(false)
  }

  const getAISummary = (project: Project) => {
    const summary = `📊 项目分析：${project.title}\n\n` +
      `技术栈：${project.tech.join(', ')}\n\n` +
      `描述：${project.description}\n\n` +
      `建议：\n• 突出项目的技术难点\n• 展示业务价值\n• 量化成果指标（如性能提升 X%）`;
    setAiSummary(summary)
  }

  const deleteProject = async (id: number) => {
    await storage.deleteProject(id)
    setProjects(projects.filter(p => p.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成': return '#22c55e'
      case '进行中': return '#f59e0b'
      case '规划中': return '#6b7280'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>📂 项目作品</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 添加项目'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>添加新项目</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>项目名称</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>项目描述</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div className="form-group">
              <label>技术栈 (用逗号分隔)</label>
              <input
                type="text"
                value={formData.tech}
                onChange={e => setFormData({ ...formData, tech: e.target.value })}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
            <button type="submit" className="btn btn-primary">保存</button>
          </form>
        </div>
      )}

      {aiSummary && (
        <div className="card" style={{ background: 'var(--bg)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>🤖 AI 项目分析</h3>
            <button onClick={() => setAiSummary(null)}>关闭</button>
          </div>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{aiSummary}</p>
        </div>
      )}

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="card project-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3>{project.title}</h3>
              <span style={{
                padding: '0.25rem 0.5rem',
                background: getStatusColor(project.status),
                color: 'white',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}>
                {project.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{project.description}</p>
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.tech.map((t, i) => (
                <span key={i} style={{
                  padding: '0.2rem 0.5rem',
                  background: 'var(--bg)',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => getAISummary(project)}>
                🤖 AI 分析
              </button>
              <button className="btn btn-secondary" onClick={() => deleteProject(project.id)} style={{ color: '#ef4444' }}>
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>暂无项目，点击上方按钮添加</p>
        </div>
      )}
    </div>
  )
}

export default Projects
