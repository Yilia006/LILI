'use client';

import { Suspense } from 'react';
import AnalyzingContent from './AnalyzingContent';

export default function AnalyzingPage() {
  return (
    <Suspense fallback={
      <div className="gradient-bg min-h-full flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="w-20 h-20 rounded-full bg-white/20 animate-pulse" />
          <p className="text-white font-medium">加载中...</p>
        </div>
      </div>
    }>
      <AnalyzingContent />
    </Suspense>
  );
}