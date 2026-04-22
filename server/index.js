import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body
  
  if (!process.env.OPENAI_API_KEY) {
    return res.json({ 
      reply: 'AI功能暂时不可用。请在环境变量中设置 OPENAI_API_KEY 来启用AI对话功能。\n\n您可以免费使用基础对话功能，无需API密钥。' 
    })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个专业的职业顾问和面试助手，帮助用户优化简历、准备面试、总结项目经验。回答要专业、有帮助。' },
          { role: 'user', content: message }
        ]
      })
    })

    const data = await response.json()
    if (data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content })
    } else {
      res.json({ reply: 'AI响应格式错误，请重试。' })
    }
  } catch (error) {
    console.error('AI Error:', error)
    res.json({ reply: 'AI服务暂时不可用，请稍后重试。' })
  }
})

// AI Summarize endpoint
app.post('/api/ai/summarize', async (req, res) => {
  const { type, title, description, tech, content } = req.body

  let prompt = ''
  if (type === 'project') {
    prompt = `请分析以下项目并提供简洁的总结和建议：

项目名称: ${title}
项目描述: ${description}
技术栈: ${tech?.join(', ')}

请从以下几个方面分析：
1. 项目亮点
2. 技术选型合理性
3. 改进建议
4. 适合的职位方向`
  } else if (type === 'document') {
    prompt = `请总结以下文档的核心内容：

文档标题: ${title}
文档内容: ${content}

请提供：
1. 核心要点总结
2. 关键信息提取
3. 可能的优化建议（如适用）`
  }

  if (!process.env.OPENAI_API_KEY) {
    // Fallback response without AI
    if (type === 'project') {
      return res.json({
        summary: `📋 项目分析：${title}\n\n这个项目看起来是一个有趣的技术实践。技术栈使用了 ${tech?.join(', ')}，这些技术在当前市场上有很好的需求。建议在面试时准备一些具体的技术细节和项目挑战的解决方案。`
      })
    } else {
      return res.json({
        summary: `📝 文档总结\n\n标题：${title}\n\n由于AI服务未配置，无法提供深度分析。但建议您整理文档时注意结构清晰、重点突出。`
      })
    }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    if (data.choices && data.choices[0]) {
      res.json({ summary: data.choices[0].message.content })
    } else {
      res.json({ summary: 'AI响应格式错误' })
    }
  } catch (error) {
    console.error('AI Error:', error)
    res.json({ summary: 'AI服务暂时不可用' })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  注意: OPENAI_API_KEY 未设置，AI功能将使用演示模式')
  }
})
