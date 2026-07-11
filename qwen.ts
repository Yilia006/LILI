import { parseResult } from './prompt';

const QWEN_API_KEY = process.env.QWEN_API_KEY || '';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

export async function callQwen(prompt: string) {
  if (!QWEN_API_KEY) {
    throw new Error('QWEN_API_KEY not configured');
  }

  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      input: {
        messages: [
          { role: 'system', content: '你是一位专业的情感分析师。' },
          { role: 'user', content: prompt },
        ],
      },
      parameters: {
        result_format: 'message',
        max_tokens: 1500,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Qwen API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.output?.choices?.[0]?.message?.content || '';

  if (!content) {
    throw new Error('Empty response from Qwen API');
  }

  return parseResult(content);
}

export async function callQwenWithFallback(prompt: string) {
  try {
    return await callQwen(prompt);
  } catch (error) {
    console.error('Qwen API failed, using mock:', error);
    return {
      rootCause:
        '看似吵的是具体的事情，实际上双方都在表达"我希望被理解和重视"。甲方感觉自己的付出没有被看见，乙方觉得自己的努力总是被否定。这种"不被看见"的感觉才是矛盾的根源。',
      suggestions: [
        '先肯定对方的付出，再表达自己的需求。比如"谢谢你做了……"开头',
        '把"你应该"换成"我需要"，把指责变成请求',
        '每周固定一个 15 分钟的"情绪茶话会"，专门聊彼此的感受',
      ],
      script:
        '我知道你不是故意的，但我听到那句话的时候，真的感觉很委屈。我不是想怪你，我只是希望我们能更好地理解彼此。我们可以一起想想怎么避免这种情况吗？',
    };
  }
}
