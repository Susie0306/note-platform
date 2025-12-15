'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API,
})

export async function expandQueryWithAI(query: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API
  if (!apiKey) {
    console.warn('Missing DEEPSEEK_API_KEY or DEEPSEEK_API environment variable')
    return []
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一个智能搜索助手。你的任务是分析用户的搜索词，并生成3-5个在语义上高度相关、同义或关联的关键词，以便在数据库中进行模糊匹配搜索。
      
      规则：
      1. 只返回关键词列表，用英文逗号分隔。
      2. 不要包含原词（除非有非常必要的变体）。
      3. 不要输出任何解释性文字。
      4. 如果原词本身就是通过语义能找到的简单词，返回空字符串即可。
      5. 关键词应涵盖同义词、下位词、关联场景。
      
      示例：
      用户："海边"
      输出：沙滩, 海洋, 度假, 游泳, 日落
      
      用户："心情不好"
      输出：难过, 悲伤, 抑郁, 烦恼, 低落`
        },
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.3,
    })

    const text = completion.choices[0].message.content || ''
    
    const keywords = text
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
    
    return keywords
  } catch (error) {
    console.error('AI Query Expansion failed:', error)
    return []
  }
}

