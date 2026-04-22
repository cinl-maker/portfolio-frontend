import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Documents from './pages/Documents'
import AIAssistant from './pages/AIAssistant'
import Profile from './pages/Profile'

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link to={to} className={isActive ? 'active' : ''}>{children}</Link>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <div className="container nav-content">
          <h2 style={{ fontSize: '1.25rem' }}>💼 我的作品集</h2>
          <div className="nav-links">
            <NavLink to="/">首页</NavLink>
            <NavLink to="/projects">项目</NavLink>
            <NavLink to="/documents">文档</NavLink>
            <NavLink to="/ai">AI助手</NavLink>
            <NavLink to="/profile">个人资料</NavLink>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
