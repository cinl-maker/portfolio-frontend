import { useState } from 'react'

function Profile() {
  const [profile, setProfile] = useState({
    name: '张三',
    title: '全栈开发工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '北京市',
    bio: '热爱技术，专注于构建高质量的Web应用。拥有5年前后端开发经验。',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker'],
    experience: '5年',
    education: '计算机科学学士'
  })

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleSave = () => {
    setProfile(formData)
    setEditing(false)
  }

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>个人资料</h1>
        <button 
          className={`btn ${editing ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => editing ? handleSave() : setEditing(true)}
        >
          {editing ? '保存' : '编辑'}
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem'
          }}>
            {profile.name[0]}
          </div>
          <div>
            {editing ? (
              <>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}
                />
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ fontSize: '1rem', color: 'var(--text-muted)' }}
                />
              </>
            ) : (
              <>
                <h2>{profile.name}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{profile.title}</p>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label>邮箱</label>
            {editing ? (
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>
          <div className="form-group">
            <label>电话</label>
            {editing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            ) : (
              <p>{profile.phone}</p>
            )}
          </div>
          <div className="form-group">
            <label>所在地</label>
            {editing ? (
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            ) : (
              <p>{profile.location}</p>
            )}
          </div>
          <div className="form-group">
            <label>工作年限</label>
            <p>{profile.experience}</p>
          </div>
          <div className="form-group">
            <label>学历</label>
            <p>{profile.education}</p>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>个人简介</label>
          {editing ? (
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            />
          ) : (
            <p>{profile.bio}</p>
          )}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem' }}>技能</label>
          {editing ? (
            <input
              type="text"
              value={formData.skills.join(', ')}
              onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
              placeholder="用逗号分隔技能"
            />
          ) : (
            <div className="tags">
              {profile.skills.map(skill => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
