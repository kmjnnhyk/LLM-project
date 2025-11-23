/**
 * 영양제 추천 응답 검증 테스트
 */

import { describe, it, expect } from '@jest/globals';
import { validateNutritionResponse } from '../../validators/nutrition';
import type { NutritionResponse } from '@algocare/utils/types';

describe('validateNutritionResponse', () => {
  it('유효한 영양제 추천 응답을 검증해야 합니다', () => {
    const validResponse: NutritionResponse = {
      recommendations: [
        {
          name: '비타민 D',
          reason: '칼슘 흡수에 도움',
          priority: 1,
          dosage: '하루 1회',
          timing: '식후',
        },
        {
          name: '오메가-3',
          reason: '심혈관 건강',
          priority: 2,
        },
      ],
      summary: '비타민 D와 오메가-3를 추천합니다.',
      warnings: ['임산부는 의사와 상담하세요'],
      error: null,
    };

    const result = validateNutritionResponse(validResponse);
    expect(result).toEqual(validResponse);
  });

  it('에러가 포함된 응답도 검증해야 합니다', () => {
    const responseWithError: NutritionResponse = {
      recommendations: [],
      summary: '',
      error: [
        {
          type: 'healthConcerns',
          message: '건강 고민 정보가 부족합니다.',
        },
      ],
    };

    const result = validateNutritionResponse(responseWithError);
    expect(result).toEqual(responseWithError);
  });

  it('warnings가 없는 응답도 검증해야 합니다', () => {
    const responseWithoutWarnings: NutritionResponse = {
      recommendations: [
        {
          name: '비타민 C',
          reason: '면역력 향상',
          priority: 1,
        },
      ],
      summary: '비타민 C를 추천합니다.',
      error: null,
    };

    const result = validateNutritionResponse(responseWithoutWarnings);
    expect(result).toEqual(responseWithoutWarnings);
  });

  it('recommendations가 빈 배열인 경우를 처리해야 합니다', () => {
    const emptyRecommendations: NutritionResponse = {
      recommendations: [],
      summary: '추천할 영양제가 없습니다.',
      error: null,
    };

    const result = validateNutritionResponse(emptyRecommendations);
    expect(result).toEqual(emptyRecommendations);
  });

  it('잘못된 응답 형식이면 에러를 던져야 합니다', () => {
    const invalidResponse = {
      recommendations: [
        {
          name: '', // 빈 문자열 (최소 길이 위반)
          reason: '이유',
          priority: 1,
        },
      ],
      summary: '요약',
      error: null,
    };

    expect(() => validateNutritionResponse(invalidResponse)).toThrow();
  });

  it('priority가 범위를 벗어나면 에러를 던져야 합니다', () => {
    const invalidPriority = {
      recommendations: [
        {
          name: '비타민',
          reason: '이유',
          priority: 4, // 1-3 범위 초과
        },
      ],
      summary: '요약',
      error: null,
    };

    expect(() => validateNutritionResponse(invalidPriority)).toThrow();
  });

  it('error 타입이 잘못되면 에러를 던져야 합니다', () => {
    const invalidErrorType = {
      recommendations: [],
      summary: '',
      error: [
        {
          type: 'invalidType', // 'healthConcerns' | 'medications'가 아님
          message: '에러 메시지',
        },
      ],
    };

    expect(() => validateNutritionResponse(invalidErrorType)).toThrow();
  });

  it('recommendations가 배열이 아니면 에러를 던져야 합니다', () => {
    const invalidRecommendations = {
      recommendations: 'not an array',
      summary: '요약',
      error: null,
    };

    expect(() => validateNutritionResponse(invalidRecommendations)).toThrow();
  });
});
