import { useState, useEffect } from 'react';
import { User, FolderGit2, FileText, Bot, Menu, X, Send, Sparkles, ExternalLink, Github, Star, Trash2, Upload, File, Download, BarChart3, FileUp } from 'lucide-react';

// API 基础 URL - 配置后端地址
// 开发环境: http://localhost:3000
// 生产环境: 部署后填写你的后端地址
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// 类型定义
interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  github: string;
  avatar: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  github_url: string;
  demo_url: string;
  image: string;
  featured: boolean;
}

interface Skill {
  id?: number;
  name: string;
  level: number;
  category: string;
}

interface Document {
  id: number;
  title: string;
  content?: string;
  summary?: string;
  file_type: string;
  created_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Resume {
  id: number;
  title: string;
  file_path?: string;
  content?: string;
  is_active: boolean;
  created_at: string;
}

interface VisitorStats {
  total: number;
  today: number;
  this_week: number;
  popular_pages: { page: string; count: number }[];
}

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);

  // 获取数据
  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchSkills();
    fetchDocuments();
    fetchResumes();
    fetchVisitorStats();
  }, []);

  // 追踪访客
  useEffect(() => {
    trackVisitor(activeTab);
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE}/skills`);
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents`);
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${API_BASE}/resumes`);
      const data = await res.json();
      setResumes(data);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const fetchVisitorStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/visitors/stats`);
      const data = await res.json();
      setVisitorStats(data);
    } catch (err) {
      console.error('Failed to fetch visitor stats:', err);
    }
  };

  // 上传简历
  const handleResumeUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${API_BASE}/resumes`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchResumes();
        setShowResumeUpload(false);
      }
    } catch (err) {
      console.error('Failed to upload resume:', err);
    }
  };

  // 激活简历
  const activateResume = async (id: number) => {
    try {
      await fetch(`${API_BASE}/resumes/${id}/activate`, { method: 'PUT' });
      fetchResumes();
    } catch (err) {
      console.error('Failed to activate resume:', err);
    }
  };

  // 删除简历
  const deleteResume = async (id: number) => {
    if (!confirm('确定要删除这份简历吗？')) return;
    try {
      await fetch(`${API_BASE}/resumes/${id}`, { method: 'DELETE' });
      fetchResumes();
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  // 追踪访客
  const trackVisitor = async (page: string) => {
    try {
      await fetch(`${API_BASE}/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `page=${encodeURIComponent(page)}`,
      });
    } catch (err) {
      console.error('Failed to track visitor:', err);
    }
  };

  // 发送消息给 AI
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context_type: selectedProject ? 'project' : selectedDoc ? 'document' : null,
          context_id: selectedProject?.id || selectedDoc?.id
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，AI 服务暂时不可用。' }]);
    }

    setIsTyping(false);
  };

  const tabs = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'projects', label: '项目作品', icon: FolderGit2 },
    { id: 'documents', label: '文档中心', icon: FileText },
    { id: 'resumes', label: '我的简历', icon: FileUp },
    { id: 'stats', label: '访问统计', icon: BarChart3 },
    { id: 'ai-chat', label: 'AI 助手', icon: Bot },
  ];

  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="font-bold text-xl gradient-text">Portfolio</span>
            </div>

            {/* 桌面导航 */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* 移动端菜单 */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {/* 个人信息 */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold">
                {profile?.name?.[0] || '求'}
              </div>
              <h1 className="text-3xl font-bold mb-2">{profile?.name || '加载中...'}</h1>
              <p className="text-xl text-purple-400 mb-4">{profile?.title || ''}</p>
              <p className="text-gray-400 max-w-2xl mx-auto mb-6">{profile?.bio || ''}</p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                    📧 {profile.email}
                  </a>
                )}
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
              </div>
            </div>

            {/* 技能展示 */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" /> 技术栈
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-purple-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 项目作品 */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-blue-400" /> 项目作品
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map(project => (
                <div key={project.id} className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
                  {project.image && (
                    <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <FolderGit2 className="w-16 h-16 text-blue-400/50" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.split(',').map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                          <Github className="w-4 h-4" /> 源码
                        </a>
                      )}
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition">
                          <ExternalLink className="w-4 h-4" /> 演示
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setSelectedDoc(null);
                          setActiveTab('ai-chat');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition">
                        <Bot className="w-4 h-4" /> AI 总结
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 文档中心 */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-400" /> 文档中心
            </h2>
            
            <div className="grid gap-4">
              {documents.map(doc => (
                <div key={doc.id} className="glass rounded-xl p-6 hover:bg-white/10 transition cursor-pointer"
                     onClick={() => {
                       setSelectedDoc(doc);
                       setSelectedProject(null);
                       setActiveTab('ai-chat');
                     }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{doc.title}</h3>
                      {doc.summary && (
                        <p className="text-gray-400 text-sm mb-2">{doc.summary}</p>
                      )}
                      <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">
                        {doc.file_type.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                        setActiveTab('ai-chat');
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 transition">
                      <Bot className="w-5 h-5 text-green-400" />
                    </button>
                  </div>
                </div>
              ))}
              
              {documents.length === 0 && (
                <div className="glass rounded-xl p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">暂无文档，上传简历或项目文档开始使用</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 简历管理 */}
        {activeTab === 'resumes' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileUp className="w-6 h-6 text-yellow-400" /> 我的简历
              </h2>
              <button
                onClick={() => setShowResumeUpload(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition">
                <Upload className="w-4 h-4" /> 上传简历
              </button>
            </div>
            
            {/* 上传表单 */}
            {showResumeUpload && (
              <div className="glass rounded-xl p-6">
                <form onSubmit={handleResumeUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">简历标题</label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="如：2024年最新版简历"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-yellow-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">上传文件 (PDF/Markdown)</label>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.md,.txt"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-yellow-500/20 file:text-yellow-400"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition">
                      上传
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResumeUpload(false)}
                      className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                      取消
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* 简历列表 */}
            <div className="grid gap-4">
              {resumes.map(resume => (
                <div key={resume.id} className={`glass rounded-xl p-6 ${resume.is_active ? 'border-yellow-500/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <File className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{resume.title}</h3>
                          {resume.is_active && (
                            <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs">当前显示</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          上传于 {new Date(resume.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!resume.is_active && (
                        <button
                          onClick={() => activateResume(resume.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition text-sm">
                          设为显示
                        </button>
                      )}
                      {resume.file_path && (
                        <a
                          href={`/uploads/${resume.file_path.split('/').pop()}`}
                          download
                          className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition text-sm flex items-center gap-1">
                          <Download className="w-4 h-4" /> 下载
                        </a>
                      )}
                      <button
                        onClick={() => deleteResume(resume.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {resume.content && (
                    <div className="mt-4 p-4 rounded-lg bg-white/5 text-gray-300 text-sm whitespace-pre-wrap">
                      {resume.content}
                    </div>
                  )}
                </div>
              ))}
              
              {resumes.length === 0 && (
                <div className="glass rounded-xl p-12 text-center">
                  <FileUp className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 mb-4">还没有上传简历</p>
                  <button
                    onClick={() => setShowResumeUpload(true)}
                    className="px-6 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition">
                    上传第一份简历
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 访问统计 */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" /> 访问统计
            </h2>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-6 text-center">
                <p className="text-3xl font-bold text-purple-400">{visitorStats?.total || 0}</p>
                <p className="text-gray-400 text-sm mt-1">总访问量</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <p className="text-3xl font-bold text-green-400">{visitorStats?.today || 0}</p>
                <p className="text-gray-400 text-sm mt-1">今日访问</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <p className="text-3xl font-bold text-blue-400">{visitorStats?.this_week || 0}</p>
                <p className="text-gray-400 text-sm mt-1">本周访问</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <p className="text-3xl font-bold text-yellow-400">
                  {visitorStats?.popular_pages?.[0]?.count || 0}
                </p>
                <p className="text-gray-400 text-sm mt-1">最高单页</p>
              </div>
            </div>
            
            {/* 热门页面 */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" /> 热门页面
              </h3>
              <div className="space-y-3">
                {visitorStats?.popular_pages?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-gray-300">{item.page}</span>
                    <span className="text-gray-400">{item.count} 次</span>
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${Math.min(100, (item.count / (visitorStats?.total || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {(!visitorStats?.popular_pages || visitorStats.popular_pages.length === 0) && (
                  <p className="text-gray-500 text-center py-8">暂无访问数据</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI 助手 */}
        {activeTab === 'ai-chat' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-400" /> AI 助手
            </h2>

            {/* 上下文指示器 */}
            {(selectedProject || selectedDoc) && (
              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    {selectedProject ? <FolderGit2 className="w-5 h-5 text-purple-400" /> : <FileText className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">正在分析</p>
                    <p className="font-medium">{selectedProject?.title || selectedDoc?.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setSelectedDoc(null);
                    setMessages([]);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition">
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}

            {/* 聊天消息 */}
            <div className="glass rounded-2xl p-6 h-[400px] overflow-y-auto space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Bot className="w-16 h-16 text-purple-400/50 mb-4" />
                  <p className="text-gray-400 mb-2">👋 我是您的 AI 助手</p>
                  <p className="text-gray-500 text-sm">
                    {selectedProject || selectedDoc
                      ? '我可以帮您总结分析当前内容'
                      : '请先选择一个项目或文档，我可以帮您：\n• 总结项目亮点\n• 分析技术栈\n• 解答相关问题'}
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl chat-message ${
                    msg.role === 'user'
                      ? 'bg-purple-500/30 text-white'
                      : 'bg-white/5 text-gray-200'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 输入框 */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="输入您的问题..."
                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition"
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !inputMessage.trim()}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
