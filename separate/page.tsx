'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alpaca from '@/components/Alpaca';
import TagSelector from '@/components/TagSelector';

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

export default function SeparatePage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [code, setCode] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!content.trim()) return;
    const style = sessionStorage.getItem('style') || 'mediator';
    const newCode = generateCode();

    // Store case data in sessionStorage for the join page
    const caseData = {
      code: newCode,
      style,
      sideA: { content, tags },
      sideB: null,
      status: 'waiting',
    };
    const existingCases = JSON.parse(sessionStorage.getItem('cases') || '{}');
    existingCases[newCode] = caseData;
    sessionStorage.setItem('cases', JSON.stringify(existingCases));

    setCode(newCode);
  };

  if (code) {
    return (
      <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <Alpaca mood="default" size={120} />

          <div className="card p-6 w-full text-center">
            <p className="text-[#666666] mb-4">你的邀请码已生成</p>
            <p className="text-4xl font-bold text-[#FF8C6B] tracking-widest mb-4">
              {code}
            </p>
            <p className="text-sm text-[#666666] mb-4">
              把邀请码发给对方，等 TA 填写
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                alert('已复制到剪贴板');
              }}
              className="btn-primary text-sm"
            >
              复制邀请码
            </button>
          </div>

          <div className="card p-5 w-full">
            <p className="text-sm text-[#666666] mb-2">案件状态</p>
            <p className="text-[#1a1a1a] font-medium">等待对方填写...</p>
            <p className="text-xs text-[#999999] mt-1">对方需在同一设备上输入邀请码</p>
          </div>

          <button
            onClick={() => router.push(`/separate/join?code=${code}`)}
            className="btn-secondary w-full"
          >
            查看状态
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">
        <div className="flex items-center">
          <button onClick={() => router.push('/style')} className="text-white/80 hover:text-white text-sm">
            {'<'} 返回
          </button>
        </div>

        <div className="flex justify-center">
          <Alpaca mood="default" size={80} />
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">第一步：说说你的版本</h3>
          <p className="text-sm text-[#666666] mb-4">把事情经过和你的感受写下来</p>

          <p className="text-sm font-medium text-[#1a1a1a] mb-2">问题类型（可选）</p>
          <TagSelector selected={tags} onChange={setTags} />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="例如：今天因为家务的事情吵了一架，我觉得对方从来不主动帮忙..."
            className="w-full h-40 mt-4 p-3 rounded-lg border border-[#E5E5E5] focus:border-[#FF8C6B] focus:ring-1 focus:ring-[#FF8C6B] outline-none resize-none text-[#333333]"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`btn-primary w-full ${!content.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          提交我的版本
        </button>
      </div>
    </div>
  );
}