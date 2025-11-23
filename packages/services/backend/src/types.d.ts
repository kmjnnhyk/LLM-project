/**
 * 백엔드 전용 타입 정의
 * 이 파일의 타입들은 백엔드 패키지 내에서 전역으로 사용 가능합니다.
 */

import type { NutritionRecommendation, OnboardingData } from '@algocare/utils/types';

declare global {
  /**
   * API 에러 응답
   */
  interface ErrorResponse {
    message: string;
    type?: 'validation_error';
    field?: 'healthConcerns' | 'medications';
    errors?: ValidationError[];
  }

  /**
   * 입력 데이터 검증 에러
   */
  interface ValidationError {
    type: 'healthConcerns' | 'medications';
    message: string;
  }

  /**
   * 영양제 추천 응답
   */
  interface NutritionResponse {
    recommendations: NutritionRecommendation[];
    summary: string;
    warnings?: string[];
    error: ValidationError[] | null;
  }
}
