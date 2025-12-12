import type { NextRequest } from 'next/server';

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {
    apiKey: key,
    model = 'deepseek-chat', // 默认为 DeepSeek
    prompt,
    system,
  } = await req.json();

  // 优先使用 DEEPSEEK_API_KEY，其次是 AI_GATEWAY_API_KEY，最后是 OPENAI_API_KEY
  const apiKey = key || process.env.DEEPSEEK_API_KEY || process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing API key.' },
      { status: 401 }
    );
  }

  // 配置 OpenAI provider 以支持 DeepSeek
  // 如果使用的是 DeepSeek Key，则设置 baseURL
  const isDeepSeek = !!process.env.DEEPSEEK_API_KEY || model.includes('deepseek');
  
  const openai = createOpenAI({
    apiKey,
    baseURL: isDeepSeek ? 'https://api.deepseek.com' : undefined,
  });

  try {
    const result = await generateText({
      abortSignal: req.signal,
      maxOutputTokens: 50,
      model: openai(model), // 使用自定义的 openai 实例
      prompt,
      system,
      temperature: 0.7,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Copilot Error:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
