/**
 * 영양제 추천 프롬프트 템플릿
 */
import type { OnboardingData } from '@algocare/utils/types';
/**
 * 온보딩 데이터를 기반으로 영양제 추천 프롬프트를 생성합니다.
 */
export declare function buildNutritionPrompt(data: OnboardingData): string;
/**
 * JSON Schema를 포함한 프롬프트 (Structured Outputs용)
 */
export declare function buildNutritionPromptWithSchema(data: OnboardingData): {
    prompt: string;
    schema: unknown;
};
/**
 * Few-shot 예시를 포함한 프롬프트
 */
export declare function buildNutritionPromptWithExamples(data: OnboardingData): string;
//# sourceMappingURL=nutrition.d.ts.map