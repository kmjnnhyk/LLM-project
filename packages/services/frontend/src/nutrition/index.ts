/**
 * 영양제 추천 서비스
 * 온보딩 데이터를 받아 LLM을 통해 맞춤형 영양제 추천을 받습니다.
 */

import { post, ApiClientError } from '../api/client';
import type { OnboardingData, NutritionResponse } from '@algocare/utils/types';

export { ApiClientError };

/**
 * 온보딩 데이터를 기반으로 영양제 추천을 받습니다.
 *
 * @param data - 온보딩 폼 데이터
 * @returns 영양제 추천 결과
 * @throws {ApiClientError} API 요청 실패 시 (에러 형식: { message: string })
 *
 * @example
 * ```tsx
 * try {
 *   const recommendations = await getNutritionRecommendations({
 *     age: 30,
 *     gender: 'male',
 *     healthConcerns: ['digestion'],
 *     lifestylePattern: { exercise: 'none', sleepQuality: 'good', stressLevel: 'low' },
 *     medications: '비피더스 유산균',
 *     weight: 80
 *   });
 * } catch (error) {
 *   if (error instanceof ApiClientError) {
 *     console.error(error.message); // 백엔드에서 반환한 에러 메시지
 *   }
 * }
 * ```
 */
export async function getNutritionRecommendations(
  data: OnboardingData
): Promise<NutritionResponse> {
  console.log('🔵 getNutritionRecommendations 시작', data);
  try {
    console.log('🔵 post 함수 호출 전');
    const result = await post<NutritionResponse>('/api/nutrition/recommendations', data);
    console.log('🔵 post 함수 호출 후', result);
    return result;
  } catch (error) {
    console.error('🔴 getNutritionRecommendations 에러:', error);
    // ApiClientError는 이미 올바른 형식으로 파싱되어 있음
    // 추가 검증이나 변환이 필요한 경우 여기서 처리
    throw error;
  }
}
