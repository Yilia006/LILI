'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alpaca from '@/components/Alpaca';
import { AnalysisResult } from '@/types';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const resultStr = sessionStorage.getItem('resultData');
    if (!resultStr) {
      router.push('/');
      return;
    }
    setResult(JSON.parse(resultStr));
  }, [router]);

  const handleCopy = () => {
    if (!result) return;
    const text = `【问题根源】\n${result.rootCause}\n\n【解决建议】\n${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n【沟通话术】\n${result.script}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestart = () => {
    sessionStorage.removeItem('resultData');
    sessionStorage.removeItem('togetherAnswers');
    sessionStorage.removeItem('myCode');
    sessionStorage.removeItem('analysisStyle');
    router.push('/');
  };

  if (!result) return null;

  return (
    <div className="gradient-bg min-h-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button
            onClick={handleRestart}
            className="text-white/80 hover:text-white text-sm"
          >
            {'<'} 返回首页
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Alpaca mood="completed" size={100} />
          <p className="text-white font-medium">理理分析完毕</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔍</span>
            <h3 className="text-lg font-bold text-[#1a1a1a]">问题根源</h3>
          </div>
          <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">
            {result.rootCause}
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="text-lg font-bold text-[#1a1a1a]">解决建议</h3>
          </div>
          <ul className="space-y-3">
            {result.suggestions.map((suggestion, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF8C6B] text-white text-sm flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                <p className="text-[#333333] leading-relaxed">{suggestion}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💬</span>
            <h3 className="text-lg font-bold text-[#1a1a1a]">沟通话术</h3>
          </div>
          <div className="bg-[#FFF5F0] rounded-lg p-4">
            <p className="text-[#333333] leading-relaxed italic">
              "{result.script}"
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="mt-3 text-sm text-[#FF8C6B] font-medium hover:underline"
          >
            {copied ? '已复制！' : '复制这段话'}
          </button>
        </div>

        <div className="flex gap-3 mt-2">
          <button onClick={handleRestart} className="btn-secondary flex-1">
            重新评理
          </button>
          <button onClick={handleCopy} className="btn-primary flex-1">
            {copied ? '已复制' : '复制分享'}
          </button>
        </div>
      </div>
    </div>
  );
}
