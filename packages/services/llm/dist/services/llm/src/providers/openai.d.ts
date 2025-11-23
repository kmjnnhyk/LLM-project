/**
 * OpenAI LLM 제공자 구현
 */
import type { OnboardingData } from '@algocare/utils/types';
import type { LLMConfig } from '../types.d';
import type { NutritionResponse } from '@algocare/utils/types';
export interface OpenAIOptions extends LLMConfig {
}
/**
 * OpenAI를 사용하여 영양제 추천을 받습니다.
 *
 * @param data - 온보딩 데이터
 * @param options - OpenAI 설정 옵션
 * @returns 영양제 추천 결과
 */
export declare function getNutritionRecommendationWithOpenAI(data: OnboardingData, options: OpenAIOptions): Promise<NutritionResponse>;
//# sourceMappingURL=openai.d.ts.map