'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Alpaca from '@/components/Alpaca';
import TagSelector from '@/components/TagSelector';
import { buildCasePrompt } from '@/lib/prompt';
import { analyzeWithQwen, getMockResult } from '@/lib/qwenClient';

const QWEN_API_KEY = 'sk-placeholder';

// Simple in-memory case store for static mode
const cases = new Map<string, any>();

function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState(initialCode);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSearch = () => {
    if (!inputCode.trim()) return;
    const code = inputCode.trim().toUpperCase();
    const c = cases.get(code);
    if (c && c.status !== 'completed') {
      setCaseData(c);
      setError('');
    } else if (c && c.status === 'completed') {
      sessionStorage.setItem('resultData', JSON.stringify(c.result));
      sessionStorage.setItem('analysisStyle', c.style);
      router.push('/result');
    } else {
      setError('邀请码无效或已过期');
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !caseData) return;
    setLoading(true);

    try {
      const style = caseData.style;
      const sideB = { content, tags };

      // Update case
      caseData.sideB = sideB;
      caseData.status = 'analyzing';
      cases.set(caseData.code, caseData);

      // Analyze
      const prompt = buildCasePrompt(style, caseData.sideA, sideB);
      let result;
      try {
        result = await analyzeWithQwen(prompt, QWEN_API_KEY);
      } catch {
        result = getMockResult();
      }

      caseData.result = result;
      caseData.status = 'completed';
      cases.set(caseData.code, caseData);

      sessionStorage.setItem('resultData', JSON.stringify(result));
      sessionStorage.setItem('analysisStyle', style);
      router.push('/result');
    } catch (err) {
      setError('分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleSearch();
    }
  }, [initialCode]);

  if (!caseData) {
    return (
      <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <Alpaca mood="default" size={100} />

          <div className="card p-6 w-full">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
              输入邀请码参与评理
            </h3>
            <input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="例如：A7K9B2"
              maxLength={6}
              className="w-full p-3 rounded-lg border border-[#E5E5E5] focus:border-[#FF8C6B] focus:ring-1 focus:ring-[#FF8C6B] outline-none text-center text-xl tracking-widest uppercase text-[#333333]"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex gap-3 w-full">
            <button onClick={() => router.push('/')} className="btn-secondary flex-1">
              返回首页
            </button>
            <button
              onClick={handleSearch}
              disabled={!inputCode.trim()}
              className={`btn-primary flex-1 ${!inputCode.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              进入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setCaseData(null); setError(''); }} className="text-white/80 hover:text-white text-sm">
            {'<'} 返回
          </button>
          <span className="text-white/80 text-sm">邀请码：{caseData.code}</span>
        </div>

        <div className="flex justify-center">
          <Alpaca mood="default" size={80} />
        </div>

        <div className="card p-5">
          <p className="text-sm text-[#666666] mb-2">对方说的版本</p>
          <p className="text-[#1a1a1a] whitespace-pre-wrap">{caseData.sideA.content}</p>
          {caseData.sideA.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {caseData.sideA.tags.map((t: string) => (
                <span key={t} className="px-2 py-1 bg-[#FF8C6B]/10 text-[#FF8C6B] rounded-full text-xs">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">说说你的版本</h3>
          <p className="text-sm text-[#666666] mb-4">从你自己的角度描述事情经过</p>
          <TagSelector selected={tags} onChange={setTags} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的想法..."
            className="w-full h-32 mt-4 p-3 rounded-lg border border-[#E5E5E5] focus:border-[#FF8C6B] focus:ring-1 focus:ring-[#FF8C6B] outline-none resize-none text-[#333333]"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className={`btn-primary w-full ${!content.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? '分析中...' : '提交我的版本'}
        </button>
      </div>
    </div>
  );
}

// Export generateCode for use in separate page
export { generateCode, cases };