'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Alpaca from '@/components/Alpaca';
import { buildAnalyzePrompt } from '@/lib/prompt';
import { analyzeWithQwen, getMockResult } from '@/lib/qwenClient';

const QWEN_API_KEY = 'sk-placeholder'; // Replace with real key in .env

export default function AnalyzingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const [error, setError] = useState('');

  useEffect(() => {
    const analyze = async () => {
      try {
        if (mode === 'together') {
          const answersStr = sessionStorage.getItem('togetherAnswers');
          const style = sessionStorage.getItem('analysisStyle') || 'mediator';

          if (!answersStr) {
            router.push('/');
            return;
          }

          const answers = JSON.parse(answersStr);
          const prompt = buildAnalyzePrompt(style, answers);

          let result;
          try {
            result = await analyzeWithQwen(prompt, QWEN_API_KEY);
          } catch {
            result = getMockResult();
          }

          sessionStorage.setItem('resultData', JSON.stringify(result));
          router.push('/result');
        } else {
          // separate mode - poll the serverless function or use mock
          const result = getMockResult();
          sessionStorage.setItem('resultData', JSON.stringify(result));
          router.push('/result');
        }
      } catch (err) {
        console.error('Analyze error:', err);
        setError('分析失败，请重试');
      }
    };

    analyze();
  }, [mode, router]);

  return (
    <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <Alpaca mood="analyzing" size={180} />

        <div className="text-center">
          <h2 className="text-xl font-bold text-white drop-shadow-sm mb-2">
            理理正在认真分析中...
          </h2>
          <p className="text-sm text-white/70">
            换位思考不是容易的事，请稍等
          </p>
        </div>

        {error && (
          <div className="card p-4 w-full text-center">
            <p className="text-red-500 mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm"
            >
              重试
            </button>
          </div>
        )}
      </div>
    </div>
  );
}