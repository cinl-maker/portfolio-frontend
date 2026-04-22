function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>欢迎来到我的个人空间</h1>
          <p>我是全栈开发工程师，专注于构建优雅、高性能的Web应用程序</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/projects" className="btn btn-primary">查看项目</a>
            <a href="/ai" className="btn btn-secondary">与AI对话</a>
          </div>
        </div>
      </section>
      
      <section className="container">
        <h2 style={{ marginBottom: '1.5rem' }}>技术栈</h2>
        <div className="tags">
          <span className="tag">React</span>
          <span className="tag">TypeScript</span>
          <span className="tag">Node.js</span>
          <span className="tag">Python</span>
          <span className="tag">PostgreSQL</span>
          <span className="tag">Docker</span>
          <span className="tag">AWS</span>
        </div>

        <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>最新项目</h2>
        <div className="grid">
          <div className="card">
            <h3>电商平台</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              基于微服务架构的B2C电商平台，支持高并发和秒杀功能
            </p>
            <div className="tags" style={{ marginTop: '1rem' }}>
              <span className="tag" style={{ background: 'var(--secondary)' }}>Vue3</span>
              <span className="tag" style={{ background: 'var(--secondary)' }}>Spring Cloud</span>
            </div>
          </div>
          <div className="card">
            <h3>即时通讯应用</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              实时聊天应用，支持文字、语音、图片消息
            </p>
            <div className="tags" style={{ marginTop: '1rem' }}>
              <span className="tag" style={{ background: 'var(--secondary)' }}>React</span>
              <span className="tag" style={{ background: 'var(--secondary)' }}>WebSocket</span>
            </div>
          </div>
          <div className="card">
            <h3>数据分析平台</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              可视化数据分析工具，支持多种数据源接入
            </p>
            <div className="tags" style={{ marginTop: '1rem' }}>
              <span className="tag" style={{ background: 'var(--secondary)' }}>Python</span>
              <span className="tag" style={{ background: 'var(--secondary)' }}>D3.js</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
