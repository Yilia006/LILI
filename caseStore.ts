import { Case, AnalysisResult, AIStyle } from '@/types';

const cases = new Map<string, Case>();

function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createCase(style: AIStyle, sideA: { content: string; tags: string[] }): string {
  let code = generateCode();
  while (cases.has(code)) {
    code = generateCode();
  }

  const now = Date.now();
  const caseData: Case = {
    code,
    style,
    sideA,
    sideB: null,
    status: 'waiting',
    result: null,
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  };

  cases.set(code, caseData);
  return code;
}

export function getCase(code: string): Case | null {
  cleanup();
  return cases.get(code) || null;
}

export function submitSideB(
  code: string,
  sideB: { content: string; tags: string[] }
): Case | null {
  cleanup();
  const caseData = cases.get(code);
  if (!caseData) return null;
  if (caseData.sideB) return null;

  caseData.sideB = sideB;
  caseData.status = 'analyzing';
  return caseData;
}

export function setResult(code: string, result: AnalysisResult): boolean {
  const caseData = cases.get(code);
  if (!caseData) return false;

  caseData.result = result;
  caseData.status = 'completed';
  caseData.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return true;
}

function cleanup() {
  const now = Date.now();
  for (const [code, caseData] of cases.entries()) {
    if (caseData.expiresAt < now) {
      cases.delete(code);
    }
  }
}

setInterval(cleanup, 60 * 60 * 1000);
