import { AIStyle, Answer } from '@/types';

const stylePrompts: Record<AIStyle, string> = {
  judge: `你是一位严肃但公正的关系法官。你的任务是客观分析情侣吵架事件，指出双方各自的合理之处和不合理之处，不回避问题，也不和稀泥。语气直接、理性，像一份判决书。请用中文回答。`,
  mediator: `你是一位温和有经验的关系调解员。你的任务是理解双方的情绪和立场，先共情，再分析。重点不是谁对谁错，而是帮助双方理解彼此，找到和好的路径。语气温暖、包容，像一位知心朋友。请用中文回答。`,
  comedian: `你是一位幽默的吐槽担当。你用轻松调侃的方式帮情侣化解矛盾，两边都善意地"吐槽"一下，让气氛松弛下来。语气俏皮、幽默，但核心是真心希望两人和好。请用中文回答。`,
};

export function buildAnalyzePrompt(style: AIStyle, answers: Answer[], tags?: string[]): string {
  const stylePrompt = stylePrompts[style];

  let qaText = '';
  answers.forEach((a, i) => {
    qaText += `\n问题${i + 1}：${a.question}\n甲方：${a.sideA}\n乙方：${a.sideB}\n`;
  });

  const tagText = tags && tags.length > 0 ? `\n标签：${tags.join('、')}` : '';

  return `${stylePrompt}

请根据以下情侣吵架的双方回答进行分析：${qaText}${tagText}

请按以下格式输出：

【问题根源】
（1-2 段分析，指出表面冲突和深层原因）

【解决建议】
1. （具体可操作的建议）
2. （具体可操作的建议）
3. （具体可操作的建议）

【沟通话术】
（一段可以直接复制发给对方的话，语气根据角色设定调整）`;
}

export function buildCasePrompt(
  style: AIStyle,
  sideA: { content: string; tags: string[] },
  sideB: { content: string; tags: string[] }
): string {
  const stylePrompt = stylePrompts[style];

  const allTags = [...new Set([...sideA.tags, ...sideB.tags])];
  const tagText = allTags.length > 0 ? `\n标签：${allTags.join('、')}` : '';

  return `${stylePrompt}

请根据以下情侣吵架的双方陈述进行分析：

甲方版本：
${sideA.content}

乙方版本：
${sideB.content}
${tagText}

请按以下格式输出：

【问题根源】
（1-2 段分析，指出表面冲突和深层原因）

【解决建议】
1. （具体可操作的建议）
2. （具体可操作的建议）
3. （具体可操作的建议）

【沟通话术】
（一段可以直接复制发给对方的话，语气根据角色设定调整）`;
}

export function parseResult(text: string): { rootCause: string; suggestions: string[]; script: string } {
  const rootCauseMatch = text.match(/【问题根源】\s*\n?([\s\S]*?)(?=【解决建议】|$)/);
  const suggestionsMatch = text.match(/【解决建议】\s*\n?([\s\S]*?)(?=【沟通话术】|$)/);
  const scriptMatch = text.match(/【沟通话术】\s*\n?([\s\S]*)/);

  const rootCause = rootCauseMatch ? rootCauseMatch[1].trim() : '分析中...';

  const suggestions: string[] = [];
  if (suggestionsMatch) {
    const lines = suggestionsMatch[1].trim().split('\n');
    for (const line of lines) {
      const match = line.match(/^\d+\.\s*(.+)/);
      if (match) {
        suggestions.push(match[1].trim());
      }
    }
  }

  const script = scriptMatch ? scriptMatch[1].trim() : '';

  return { rootCause, suggestions, script };
}
