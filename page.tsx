'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alpaca from '@/components/Alpaca';

export default function Home() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const selectMode = (mode: 'together' | 'separate') => {
    sessionStorage.setItem('mode', mode);
    router.push('/style');
  };

  return (
    <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Alpaca mood={hovered ? 'hover' : 'default'} size={160} />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm mb-2">
            理理
          </h1>
          <p className="text-xl text-white/90 font-medium mb-1">
            吵架了？我来评评理
          </p>
          <p className="text-sm text-white/70">
            AI 帮你理清思路，不伤感情
          </p>
        </div>

        <div className="w-full flex flex-col gap-4 mt-4">
          <button
            onClick={() => selectMode('together')}
            className="btn-primary w-full"
          >
            一起评理
            <span className="block text-xs text-[#666666] font-normal mt-0.5">
              两人一起坐下来评
            </span>
          </button>
          <button
            onClick={() => selectMode('separate')}
            className="btn-secondary w-full"
          >
            各自评理
            <span className="block text-xs text-[#666666] font-normal mt-0.5">
              分别说说你的版本
            </span>
          </button>
        </div>

        <p className="text-xs text-white/60 mt-4 text-center">
          完全匿名 · 关闭即焚 · 无需注册
        </p>
      </div>
    </div>
  );
}
