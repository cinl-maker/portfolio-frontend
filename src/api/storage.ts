// 本地存储 + 后端 API 混合模式
// 优先使用后端 API，失败时降级到 localStorage

const API_BASE = 'https://api.jsonbin.io/v3';

// JSONBin 配置
const BIN_ID = localStorage.getItem('portfolio_bin_id') || '';
const MASTER_KEY = localStorage.getItem('portfolio_master_key') || '';

// 使用云端还是本地
const USE_CLOUD = BIN_ID && MASTER_KEY && BIN_ID !== 'XXXXXXXX';

// 默认数据
const DEFAULT_DATA = {
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
  projects: [],
  documents: [],
  visitors: 0
};

// 获取数据
async function getData() {
  if (USE_CLOUD) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': MASTER_KEY }
      });
      if (res.ok) {
        const json = await res.json();
        return json.record;
      }
    } catch {}
  }
  
  const local = localStorage.getItem('portfolio_data');
  return local ? JSON.parse(local) : DEFAULT_DATA;
}

// 保存数据
async function saveData(data) {
  // 始终保存到本地
  localStorage.setItem('portfolio_data', JSON.stringify(data));
  
  if (USE_CLOUD) {
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': MASTER_KEY
        },
        body: JSON.stringify(data)
      });
      return true;
    } catch {}
  }
  return false;
}

export const storage = {
  getAll: getData,
  saveAll: saveData,

  getProfile: async () => (await getData()).profile,
  setProfile: async (profile) => {
    const data = await getData();
    data.profile = profile;
    await saveData(data);
    return profile;
  },

  getProjects: async () => (await getData()).projects || [],
  addProject: async (project) => {
    const data = await getData();
    project.id = Date.now();
    data.projects.push(project);
    await saveData(data);
    return project;
  },
  deleteProject: async (id) => {
    const data = await getData();
    data.projects = data.projects.filter(p => p.id !== id);
    await saveData(data);
  },

  getDocuments: async () => (await getData()).documents || [],
  addDocument: async (doc) => {
    const data = await getData();
    doc.id = Date.now();
    doc.created_at = new Date().toISOString();
    data.documents.push(doc);
    await saveData(data);
    return doc;
  },
  deleteDocument: async (id) => {
    const data = await getData();
    data.documents = data.documents.filter(d => d.id !== id);
    await saveData(data);
  },

  recordVisit: async () => {
    const data = await getData();
    data.visitors = (data.visitors || 0) + 1;
    data.lastVisit = new Date().toISOString();
    await saveData(data);
    return data.visitors;
  },

  exportData: () => {
    getData().then(data => {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  },

  importData: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          saveData(data).then(() => resolve(data));
        } catch {
          reject(new Error('无效的文件格式'));
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });
  },

  // 设置 JSONBin 配置
  setCloudConfig: (binId, masterKey) => {
    localStorage.setItem('portfolio_bin_id', binId);
    localStorage.setItem('portfolio_master_key', masterKey);
  }
};
