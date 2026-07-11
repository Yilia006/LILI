export type AIStyle = 'judge' | 'mediator' | 'comedian';

export interface SideContent {
  content: string;
  tags: string[];
}

export interface AnalysisResult {
  rootCause: string;
  suggestions: string[];
  script: string;
}

export interface Case {
  code: string;
  style: AIStyle;
  sideA: SideContent;
  sideB: SideContent | null;
  status: 'waiting' | 'analyzing' | 'completed';
  result: AnalysisResult | null;
  createdAt: number;
  expiresAt: number;
}

export interface Answer {
  question: string;
  sideA: string;
  sideB: string;
}

export const TAGS = [
  '家务分配',
  '金钱观念',
  '沟通方式',
  '信任问题',
  '边界感',
  '第三者',
  '家庭关系',
  '工作压力',
  '生活习惯',
  '未来规划',
  '其他',
];

export const QUESTIONS = [
  '请你们各自说说，今天发生了什么？',
  '你当时听到对方说什么时最生气？',
  '你觉得对方说那句话的本意是什么？',
  '如果重来一次，你们各自希望对方怎么做？',
];
