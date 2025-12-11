'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
})

export async function generateWishMessage(wishTitle: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `你是一个温暖、充满智慧的希冀守护者。请根据用户的心愿标题，生成一句简短、充满希望和鼓励的寄语（20-40字）。
          
          要求：
          1. 语气温柔、坚定、富有诗意。
          2. 避免陈词滥调，要有针对性。
          3. 不要带引号。`
        },
        {
          role: 'user',
          content: `我的心愿是：${wishTitle}`
        }
      ],
      model: 'deepseek-chat',
      temperature: 1.3, // 提高随机性，避免重复
    })

    return completion.choices[0].message.content || '每一次的记录，都是通往梦想的脚印。坚持下去，美好的事情正在发生！'
  } catch (error) {
    console.error('AI generation failed:', error)
    return '每一次的记录，都是通往梦想的脚印。坚持下去，美好的事情正在发生！'
  }
}

export async function askAI(command: string, context: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `你是一个专业的笔记助手。请根据用户的指令和当前笔记内容（Markdown格式），协助用户写作。
          
          要求：
          1. 直接返回结果，不要啰嗦。
          2. 保持 Markdown 格式。
          3. 如果是续写，请接着上下文自然延续。
          4. 如果是润色，请保持原意但优化措辞。
          5. 如果是总结，请简明扼要。`
        },
        {
          role: 'user',
          content: `当前笔记内容：
${context}

指令：${command}`
        }
      ],
      model: 'deepseek-chat',
      temperature: 0.7,
    })

    return completion.choices[0].message.content || ''
  } catch (error) {
    console.error('AI request failed:', error)
    throw new Error('AI 请求失败')
  }
}

