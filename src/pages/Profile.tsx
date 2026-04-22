import { useState, useEffect } from 'react'
import { storage } from '../api/storage'

function Profile() {
  const [profile, setProfile] = useState({
    name: '张三',
    title: '全栈开发工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '北京市',
    bio: '热爱技术，专注于构建高质量的Web应用。',
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: '5年',
    education: '计算机科学学士'
  })
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  useEffect(() => {
    storage.getProfile().then(p => {
      if (p && Object.keys(p).length > 0) setProfile(p)
    })
  }, [])

  const handleSave = async () => {
    await storage.setProfile(formData)
    setProfile(formData)
    setEditing(false)
  }

  const getSkillsArray = (skills: any) => {
    if (typeof skills === 'string') return skills.split(',').map((s: string) => s.trim())
    if (Array.isArray(skills)) return skills
    return []
  }

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>个人信息</h1>
        <button className="btn btn-primary" onClick={() => setEditing(!editing)}>
          {editing ? '取消' : '编辑'}
        </button>
      </div>

      {editing ? (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>编辑资料</h3>
          <div className="form-group">
            <label>姓名</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>职位</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>邮箱</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>电话</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>地址</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>个人简介</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>技能 (用逗号分隔)</label>
            <input
              type="text"
              value={typeof formData.skills === 'string' ? formData.skills : formData.skills?.join(', ')}
              onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            保存
          </button>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '4rem' }}>👤</div>
            <div style={{ flex: 1 }}>
              <h2>{profile.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{profile.title}</p>
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem' }}>
                {profile.email && <span>📧 {profile.email}</span>}
                {profile.phone && <span>📱 {profile.phone}</span>}
                {profile.location && <span>📍 {profile.location}</span>}
              </div>
            </div>
          </div>
          
          {profile.bio && (
            <div style={{ marginTop: '2rem' }}>
              <h3>关于我</h3>
              <p>{profile.bio}</p>
            </div>
          )}
          
          {getSkillsArray(profile.skills).length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3>技能</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {getSkillsArray(profile.skills).map((skill: string, i: number) => (
                  <span key={i} style={{
                    padding: '0.25rem 0.75rem',
                    background: 'var(--bg)',
                    borderRadius: '1rem',
                    fontSize: '0.85rem'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
            {profile.experience && <div><strong>经验:</strong> {profile.experience}</div>}
            {profile.education && <div><strong>学历:</strong> {profile.education}</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
