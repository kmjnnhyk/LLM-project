/**
 * LLM 서비스 전용 타입 정의
 */

/**
 * LLM 설정
 */
export interface LLMConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * LLM 제공자 타입
 */
export type LLMProvider = 'openai' | 'claude' | 'custom';

// 공통 타입은 utils에서 re-export
export type { OnboardingData, NutritionRecommendation } from '@algocare/utils/types';
