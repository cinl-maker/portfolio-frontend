// 本地存储 + 导入导出功能
// 数据保存在浏览器 localStorage，支持导出/导入备份

const STORAGE_KEY = 'portfolio_data';

export const storage = {
  // 获取所有数据
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      profile: {
        name: '张三',
        title: '全栈开发工程师',
        email: 'zhangsan@example.com',
        phone: '138-0000-0000',
        location: '北京市',
        bio: '热爱技术，专注于构建高质量的Web应用。',
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: '5年',
        education: '计算机科学学士'
      },
      projects: [
        {
          id: 1,
          title: '企业管理系统',
          description: '基于React和Node.js的企业资源规划系统',
          tech: ['React', 'Node.js', 'PostgreSQL'],
          status: '已完成',
          github_url: '',
          demo_url: ''
        }
      ],
      documents: [],
      visitors: 0,
      lastVisit: new Date().toISOString()
    };
  },

  // 保存所有数据
  saveAll: (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // 获取 Profile
  getProfile: () => storage.getAll().profile,
  setProfile: (profile) => {
    const data = storage.getAll();
    data.profile = profile;
    storage.saveAll(data);
    return data.profile;
  },

  // 获取/设置 Projects
  getProjects: () => storage.getAll().projects,
  addProject: (project) => {
    const data = storage.getAll();
    project.id = Date.now();
    data.projects.push(project);
    storage.saveAll(data);
    return project;
  },
  deleteProject: (id) => {
    const data = storage.getAll();
    data.projects = data.projects.filter(p => p.id !== id);
    storage.saveAll(data);
  },

  // 获取/设置 Documents
  getDocuments: () => storage.getAll().documents,
  addDocument: (doc) => {
    const data = storage.getAll();
    doc.id = Date.now();
    doc.created_at = new Date().toISOString();
    data.documents.push(doc);
    storage.saveAll(data);
    return doc;
  },
  deleteDocument: (id) => {
    const data = storage.getAll();
    data.documents = data.documents.filter(d => d.id !== id);
    storage.saveAll(data);
  },

  // 访客统计
  recordVisit: () => {
    const data = storage.getAll();
    data.visitors = (data.visitors || 0) + 1;
    data.lastVisit = new Date().toISOString();
    storage.saveAll(data);
    return data.visitors;
  },

  // 导出数据
  exportData: () => {
    const data = storage.getAll();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // 导入数据
  importData: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          storage.saveAll(data);
          resolve(data);
        } catch {
          reject(new Error('无效的文件格式'));
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });
  }
};
