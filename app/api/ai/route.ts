import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API,
})

export async function POST(req: Request) {
  const { prompt, command, context } = await req.json()

  let systemPrompt = "你是一个专业的笔记助手，由'熙记'开发。请用Markdown格式回复。"
  let userPrompt = prompt

  if (command === 'continue') {
    systemPrompt += '请根据上下文继续写作，保持风格一致。'
    userPrompt = `上文内容：\n${context}\n\n请接着写：`
  } else if (command === 'polish') {
    systemPrompt += '请润色以下文字，使其更通顺、优美，修复语病，但不要改变原意。'
    userPrompt = `原文：\n${context}`
  } else if (command === 'summarize') {
    systemPrompt += '请为以下笔记内容生成一个简洁的摘要。'
    userPrompt = `笔记内容：\n${context}`
  }

  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
