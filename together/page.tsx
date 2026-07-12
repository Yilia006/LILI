'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Alpaca from '@/components/Alpaca';
import { QUESTIONS, Answer } from '@/types';

export default function TogetherPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    QUESTIONS.map((q) => ({ question: q, sideA: '', sideB: '' }))
  );
  const [currentSide, setCurrentSide] = useState<'A' | 'B'>('A');
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const question = QUESTIONS[currentQ];

  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i <= question.length) {
        setDisplayText(question.slice(0, i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [currentQ, question]);

  const updateAnswer = (side: 'A' | 'B', value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQ][side === 'A' ? 'sideA' : 'sideB'] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentSide === 'A') {
      if (!answers[currentQ].sideA.trim()) return;
      setCurrentSide('B');
    } else {
      if (!answers[currentQ].sideB.trim()) return;
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setCurrentSide('A');
      } else {
        submitAnalysis();
      }
    }
  };

  const submitAnalysis = useCallback(async () => {
    const style = sessionStorage.getItem('style') || 'mediator';
    sessionStorage.setItem('togetherAnswers', JSON.stringify(answers));
    sessionStorage.setItem('analysisStyle', style);
    router.push('/analyzing?mode=together');
  }, [answers, router]);

  const isLastQuestion = currentQ === QUESTIONS.length - 1;
  const btnText = currentSide === 'A' ? '轮到你了' : isLastQuestion ? '提交分析' : '下一题';

  return (
    <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/style')}
            className="text-white/80 hover:text-white text-sm"
          >
            {'<'} 返回
          </button>
          <span className="text-white/80 text-sm">
            问题 {currentQ + 1}/{QUESTIONS.length}
          </span>
        </div>

        <div className="flex justify-center">
          <Alpaca mood="default" size={80} />
        </div>

        <div className="card p-5">
          <p className="text-[#1a1a1a] font-medium min-h-[3rem]">
            {displayText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>

        <div className="card p-5">
          <label className="block text-sm font-semibold text-[#FF8C6B] mb-2">
            {currentSide === 'A' ? '甲方回答' : '乙方回答'}
          </label>
          <textarea
            value={currentSide === 'A' ? answers[currentQ].sideA : answers[currentQ].sideB}
            onChange={(e) => updateAnswer(currentSide, e.target.value)}
            placeholder="写下你的想法..."
            className="w-full h-28 p-3 rounded-lg border border-[#E5E5E5] focus:border-[#FF8C6B] focus:ring-1 focus:ring-[#FF8C6B] outline-none resize-none text-[#333333]"
          />
        </div>

        <button
          onClick={handleNext}
          disabled={
            isTyping ||
            (currentSide === 'A' ? !answers[currentQ].sideA.trim() : !answers[currentQ].sideB.trim())
          }
          className={`btn-primary w-full ${
            isTyping ||
            (currentSide === 'A' ? !answers[currentQ].sideA.trim() : !answers[currentQ].sideB.trim())
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {btnText}
        </button>
      </div>
    </div>
  );
}
