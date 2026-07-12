'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alpaca from '@/components/Alpaca';
import { AIStyle } from '@/types';

const styles: { id: AIStyle; icon: string; title: string; desc: string }[] = [
  { id: 'judge', icon: '🧑‍⚖️', title: '严肃法官', desc: '直指要害，分清是非' },
  { id: 'mediator', icon: '💕', title: '温和调解员', desc: '共情理解，促进和好' },
  { id: 'comedian', icon: '😎', title: '诙谐吐槽担当', desc: '调侃化解，笑着解决' },
];

export default function StylePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<AIStyle | null>(null);
  const [alpacaMood, setAlpacaMood] = useState<AIStyle | 'default'>('default');

  const handleSelect = (style: AIStyle) => {
    setSelected(style);
    setAlpacaMood(style);
  };

  const handleStart = () => {
    if (!selected) return;
    sessionStorage.setItem('style', selected);
    const mode = sessionStorage.getItem('mode');
    if (mode === 'together') {
      router.push('/together');
    } else {
      router.push('/separate');
    }
  };

  return (
    <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Alpaca mood={alpacaMood} size={140} />

        <div className="text-center">
          <h2 className="text-xl font-bold text-white drop-shadow-sm">
            你请什么类型的"裁判"来评理？
          </h2>
        </div>

        <div className="w-full flex flex-col gap-3">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className={`card w-full p-4 text-left transition-all duration-200 ${
                selected === s.id
                  ? 'ring-2 ring-[#FF8C6B] bg-white'
                  : 'hover:bg-white/90'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{s.title}</p>
                  <p className="text-sm text-[#666666]">{s.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => router.push('/')}
            className="btn-secondary flex-1"
          >
            返回
          </button>
          <button
            onClick={handleStart}
            disabled={!selected}
            className={`btn-primary flex-1 ${
              !selected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            开始评理
          </button>
        </div>
      </div>
    </div>
  );
}
