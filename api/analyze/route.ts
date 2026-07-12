import { NextRequest, NextResponse } from 'next/server';
import { buildAnalyzePrompt } from '@/lib/prompt';
import { callQwenWithFallback } from '@/lib/qwen';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { style, answers, tags } = body;

    if (!style || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = buildAnalyzePrompt(style, answers, tags);
    const result = await callQwenWithFallback(prompt);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
      { status: 502 }
    );
  }
}
