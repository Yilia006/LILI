'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Alpaca from '@/components/Alpaca';
import TagSelector from '@/components/TagSelector';

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
  const [submitted, setSubmitted] = useState(false);

  const fetchCase = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/case/${code}`);
      const data = await res.json();
      if (data.success) {
        setCaseData(data.case);
        if (data.case.status === 'completed') {
          sessionStorage.setItem('resultData', JSON.stringify(data.case.result));
          sessionStorage.setItem('analysisStyle', data.case.style);
          router.push('/result');
        }
      } else {
        setError(data.error || '邀请码无效或已过期');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchCase(initialCode);
    }
  }, [initialCode]);

  const handleSearch = () => {
    if (!inputCode.trim()) return;
    fetchCase(inputCode.trim().toUpperCase());
  };

  const handleSubmit = async () => {
    if (!content.trim() || !caseData) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/case/${caseData.code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sideB: { content, tags },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          fetchCase(caseData.code);
        }, 3000);
      } else {
        setError(data.error || '提交失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

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
            <button
              onClick={() => router.push('/')}
              className="btn-secondary flex-1"
            >
              返回首页
            </button>
            <button
              onClick={handleSearch}
              disabled={!inputCode.trim() || loading}
              className={`btn-primary flex-1 ${
                !inputCode.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '查询中...' : '进入'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (caseData.status === 'completed') {
    sessionStorage.setItem('resultData', JSON.stringify(caseData.result));
    sessionStorage.setItem('analysisStyle', caseData.style);
    router.push('/result');
    return null;
  }

  if (submitted || caseData.status === 'analyzing') {
    return (
      <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <Alpaca mood="analyzing" size={120} />
          <div className="card p-6 w-full text-center">
            <p className="text-[#1a1a1a] font-medium">已提交，AI 正在分析中...</p>
            <p className="text-sm text-[#666666] mt-2">
              稍等几秒后刷新查看结果
            </p>
          </div>
          <button
            onClick={() => fetchCase(caseData.code)}
            className="btn-primary w-full"
          >
            刷新查看结果
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setCaseData(null);
              setError('');
            }}
            className="text-white/80 hover:text-white text-sm"
          >
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
                <span key={t} className="px-2 py-1 bg-[#FF8C6B]/10 text-[#FF8C6B] rounded-full text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">
            说说你的版本
          </h3>
          <p className="text-sm text-[#666666] mb-4">
            从你自己的角度描述事情经过
          </p>

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
          className={`btn-primary w-full ${
            !content.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? '提交中...' : '提交我的版本'}
        </button>
      </div>
    </div>
  );
}
