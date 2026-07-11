import { NextRequest, NextResponse } from 'next/server';
import { createCase } from '@/lib/caseStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { style, sideA } = body;

    if (!style || !sideA || !sideA.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const code = createCase(style, {
      content: sideA.content,
      tags: sideA.tags || [],
    });

    return NextResponse.json({
      success: true,
      code,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error('Create case error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
