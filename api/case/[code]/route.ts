import { NextRequest, NextResponse } from 'next/server';
import { getCase, submitSideB, setResult } from '@/lib/caseStore';
import { buildCasePrompt } from '@/lib/prompt';
import { callQwenWithFallback } from '@/lib/qwen';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const caseData = getCase(code);

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: 'Case not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, case: caseData });
  } catch (error) {
    console.error('Get case error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get case' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { sideB } = body;

    if (!sideB || !sideB.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const caseData = submitSideB(code, {
      content: sideB.content,
      tags: sideB.tags || [],
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: 'Case not found or already submitted' },
        { status: 404 }
      );
    }

    // Trigger AI analysis asynchronously
    (async () => {
      try {
        if (caseData.sideA && caseData.sideB) {
          const prompt = buildCasePrompt(caseData.style, caseData.sideA, caseData.sideB);
          const result = await callQwenWithFallback(prompt);
          setResult(code, result);
        }
      } catch (error) {
        console.error('Auto analysis error:', error);
      }
    })();

    return NextResponse.json({ success: true, status: 'analyzing' });
  } catch (error) {
    console.error('Submit sideB error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit' },
      { status: 500 }
    );
  }
}
