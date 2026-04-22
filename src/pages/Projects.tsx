import { useState } from 'react'

interface Project {
  id: number
  title: string
  description: string
  tech: string[]
  status: string
  link?: string
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: '企业管理系统',
    description: '基于React和Node.js的企业资源规划系统',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    status: '已完成'
  },
  {
    id: 2,
    title: '在线教育平台',
    description: '支持直播课程和点播的在线学习系统',
    tech: ['Vue3', 'Spring Boot', 'Redis'],
    status: '进行中'
  }
]

function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', tech: '' })
  const [aiSummary, setAiSummary] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newProject: Project = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      tech: formData.tech.split(',').map(t => t.trim()),
      status: '规划中'
    }
    setProjects([...projects, newProject])
    setFormData({ title: '', description: '', tech: '' })
    setShowForm(false)
  }

  const getAISummary = async (project: Project) => {
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'project',
          title: project.title,
          description: project.description,
          tech: project.tech
        })
      })
      const data = await response.json()
      setAiSummary(data.summary)
    } catch {
      setAiSummary('AI服务暂时不可用，请检查后端配置。')
    }
  }

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>我的项目</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 添加项目'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>添加新项目</h3>
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
                required
              />
            </div>
            <div className="form-group">
              <label>技术栈 (用逗号分隔)</label>
              <input
                type="text"
                value={formData.tech}
                onChange={e => setFormData({ ...formData, tech: e.target.value })}
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">保存项目</button>
          </form>
        </div>
      )}

      {aiSummary && (
        <div className="card" style={{ background: 'var(--bg)' }}>
          <h3>🤖 AI项目分析</h3>
          <p style={{ marginTop: '0.5rem' }}>{aiSummary}</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setAiSummary(null)}>
            关闭
          </button>
        </div>
      )}

      <div className="grid">
        {projects.map(project => (
          <div key={project.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3>{project.title}</h3>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '20px', 
                fontSize: '0.75rem',
                background: project.status === '已完成' ? 'var(--secondary)' : 'var(--primary)'
              }}>
                {project.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>{project.description}</p>
            <div className="tags" style={{ marginTop: '1rem' }}>
              {project.tech.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => getAISummary(project)}>
                🤖 AI分析
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
