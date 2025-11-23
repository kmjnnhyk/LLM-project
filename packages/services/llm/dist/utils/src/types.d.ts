/**
 * 공통 타입 정의
 * 모든 패키지(backend, llm, frontend, client)에서 공통으로 사용하는 타입들을 정의합니다.
 */
import { EXERCISE_LEVEL, HEALTH_CONCERN, SLEEP_QUALITY, STRESS_LEVEL } from './enums';
/**
 * 온보딩 데이터
 */
export interface OnboardingData {
    age: number;
    gender: 'male' | 'female';
    weight: number;
    healthConcerns: HEALTH_CONCERN[];
    exercise: EXERCISE_LEVEL;
    sleepQuality: SLEEP_QUALITY;
    stressLevel: STRESS_LEVEL;
    medications: string;
}
/**
 * 영양제 추천 응답
 */
export interface NutritionResponse {
    recommendations: NutritionRecommendation[];
    summary: string;
    warnings?: string[];
    error: ValidationError[] | null;
}
/**
 * 영양제 추천 항목
 */
export interface NutritionRecommendation {
    name: string;
    reason: string;
    priority: number;
    dosage?: string;
    timing?: string;
}
/**
 * 입력 데이터 검증 에러
 */
export interface ValidationError {
    type: 'healthConcerns' | 'medications';
    message: string;
}
//# sourceMappingURL=types.d.ts.map