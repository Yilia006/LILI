'use client';

import React from 'react';
import { TAGS } from '@/types';

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selected, onChange }: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggleTag(tag)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
            selected.includes(tag)
              ? 'bg-[#FF8C6B] text-white shadow-md'
              : 'bg-white/80 text-[#666666] border border-[#E5E5E5] hover:border-[#FF8C6B] hover:text-[#FF8C6B]'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
