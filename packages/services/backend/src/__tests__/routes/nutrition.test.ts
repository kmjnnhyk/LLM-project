/**
 * 영양제 추천 API 라우트 테스트
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { Request, Response } from 'express';
import { getNutritionRecommendations } from '../../routes/nutrition';
import * as llmService from '@algocare/services-llm';
import type { OnboardingData } from '@algocare/utils/types';
import { HEALTH_CONCERN, EXERCISE_LEVEL, SLEEP_QUALITY, STRESS_LEVEL } from '@algocare/utils/enums';

// LLM 서비스 모킹
jest.mock('@algocare/services-llm', () => ({
  getNutritionRecommendationWithOpenAI:
    jest.fn<typeof llmService.getNutritionRecommendationWithOpenAI>(),
}));

describe('getNutritionRecommendations', () => {
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // 환경 변수 설정
    process.env.OPENAI_API_KEY = 'test-api-key';
    process.env.OPENAI_MODEL = 'gpt-3.5-turbo';

    // Mock Response 설정
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus as any,
      json: mockJson as any,
    };

    // Mock 초기화
    jest.clearAllMocks();
  });

  it('정상적인 성인 남성 케이스를 처리해야 합니다', async () => {
    const mockRequest: Partial<Request> = {
      body: {
        age: 30,
        gender: 'male',
        weight: 70,
        medications: '',
        healthConcerns: [HEALTH_CONCERN.immunity],
        exercise: EXERCISE_LEVEL.moderate,
        sleepQuality: SLEEP_QUALITY.good,
        stressLevel: STRESS_LEVEL.low,
      } as OnboardingData,
    };

    const mockNutritionResponse = {
      recommendations: [
        {
          name: '비타민 D',
          reason: '칼슘 흡수에 도움',
          priority: 1,
        },
      ],
      summary: '비타민 D를 추천합니다.',
      error: null,
    };

    (
      llmService.getNutritionRecommendationWithOpenAI as jest.MockedFunction<
        typeof llmService.getNutritionRecommendationWithOpenAI
      >
    ).mockResolvedValue(mockNutritionResponse);

    await getNutritionRecommendations(mockRequest as Request, mockResponse as Response);

    expect(llmService.getNutritionRecommendationWithOpenAI).toHaveBeenCalledWith(
      mockRequest.body,
      expect.objectContaining({
        apiKey: 'test-api-key',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
      })
    );
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockNutritionResponse);
  });

  it('최소 나이와 체중 엣지 케이스를 처리해야 합니다', async () => {
    const mockRequest: Partial<Request> = {
      body: {
        age: 1,
        gender: 'female',
        weight: 1,
        medications: '',
        healthConcerns: [HEALTH_CONCERN.fatigue],
        exercise: EXERCISE_LEVEL.none,
        sleepQuality: SLEEP_QUALITY.poor,
        stressLevel: STRESS_LEVEL.low,
      } as OnboardingData,
    };

    const mockNutritionResponse = {
      recommendations: [
        {
          name: '종합 비타민',
          reason: '영유아 성장 지원',
          priority: 1,
        },
      ],
      summary: '종합 비타민을 추천합니다.',
      error: null,
    };

    (
      llmService.getNutritionRecommendationWithOpenAI as jest.MockedFunction<
        typeof llmService.getNutritionRecommendationWithOpenAI
      >
    ).mockResolvedValue(mockNutritionResponse);

    await getNutritionRecommendations(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockNutritionResponse);
  });

  it('최대 나이와 체중 엣지 케이스를 처리해야 합니다', async () => {
    const mockRequest: Partial<Request> = {
      body: {
        age: 120,
        gender: 'male',
        weight: 300,
        medications: '고혈압약, 당뇨약',
        healthConcerns: [HEALTH_CONCERN.joint, HEALTH_CONCERN.memory, HEALTH_CONCERN.digestion],
        exercise: EXERCISE_LEVEL.light,
        sleepQuality: SLEEP_QUALITY.fair,
        stressLevel: STRESS_LEVEL.moderate,
      } as OnboardingData,
    };

    const mockNutritionResponse = {
      recommendations: [
        {
          name: '오메가-3',
          reason: '관절 건강 지원',
          priority: 1,
        },
        {
          name: '프로바이오틱스',
          reason: '소화 기능 개선',
          priority: 2,
        },
      ],
      summary: '고령자를 위한 영양제를 추천합니다.',
      warnings: ['복용 중인 약물과 상호작용을 확인하세요'],
      error: null,
    };

    (
      llmService.getNutritionRecommendationWithOpenAI as jest.MockedFunction<
        typeof llmService.getNutritionRecommendationWithOpenAI
      >
    ).mockResolvedValue(mockNutritionResponse);

    await getNutritionRecommendations(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockNutritionResponse);
  });

  it('여러 건강 고민과 복용 약물이 있는 케이스를 처리해야 합니다', async () => {
    const mockRequest: Partial<Request> = {
      body: {
        age: 45,
        gender: 'female',
        weight: 65,
        medications: '갑상선약, 철분제, 항우울제',
        healthConcerns: [
          HEALTH_CONCERN.fatigue,
          HEALTH_CONCERN.stress,
          HEALTH_CONCERN.sleep,
          HEALTH_CONCERN.skin,
        ],
        exercise: EXERCISE_LEVEL.intensive,
        sleepQuality: SLEEP_QUALITY.poor,
        stressLevel: STRESS_LEVEL.veryHigh,
      } as OnboardingData,
    };

    const mockNutritionResponse = {
      recommendations: [
        {
          name: '마그네슘',
          reason: '스트레스 완화 및 수면 개선',
          priority: 1,
          dosage: '취침 전 400mg',
          timing: '저녁 식후',
        },
        {
          name: '비타민 B 복합체',
          reason: '피로 회복 및 에너지 생성',
          priority: 2,
        },
        {
          name: '콜라겐',
          reason: '피부 건강 개선',
          priority: 3,
        },
      ],
      summary: '스트레스와 피로 관리에 중점을 둔 영양제를 추천합니다.',
      warnings: [
        '복용 중인 약물과의 상호작용을 의사와 상담하세요',
        '철분제와 마그네슘은 함께 복용하지 마세요',
      ],
      error: null,
    };

    (
      llmService.getNutritionRecommendationWithOpenAI as jest.MockedFunction<
        typeof llmService.getNutritionRecommendationWithOpenAI
      >
    ).mockResolvedValue(mockNutritionResponse);

    await getNutritionRecommendations(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockNutritionResponse);
  });

  it('빈 medications와 단일 건강 고민 케이스를 처리해야 합니다', async () => {
    const mockRequest: Partial<Request> = {
      body: {
        age: 25,
        gender: 'female',
        weight: 55,
        medications: '',
        healthConcerns: [HEALTH_CONCERN.skin],
        exercise: EXERCISE_LEVEL.moderate,
        sleepQuality: SLEEP_QUALITY.excellent,
        stressLevel: STRESS_LEVEL.low,
      } as OnboardingData,
    };

    const mockNutritionResponse = {
      recommendations: [
        {
          name: '비타민 C',
          reason: '콜라겐 생성 및 피부 건강',
          priority: 1,
          dosage: '하루 1000mg',
          timing: '아침 식후',
        },
        {
          name: '비타민 E',
          reason: '항산화 및 피부 보호',
          priority: 2,
        },
      ],
      summary: '피부 건강에 특화된 영양제를 추천합니다.',
      error: null,
    };

    (
      llmService.getNutritionRecommendationWithOpenAI as jest.MockedFunction<
        typeof llmService.getNutritionRecommendationWithOpenAI
      >
    ).mockResolvedValue(mockNutritionResponse);

    await getNutritionRecommendations(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockNutritionResponse);
  });

  it('운동을 많이 하고 수면이 좋은 건강한 케이스를 처리해야 합니다', async () => {
    const mockRequest: Partial<Request> = {
      body: {
        age: 35,
        gender: 'male',
        weight: 75,
        medications: '',
        healthConcerns: [HEALTH_CONCERN.other],
        exercise: EXERCISE_LEVEL.intensive,
        sleepQuality: SLEEP_QUALITY.excellent,
        stressLevel: STRESS_LEVEL.low,
      } as OnboardingData,
    };

    const mockNutritionResponse = {
      recommendations: [
        {
          name: '단백질 보충제',
          reason: '운동 후 근육 회복',
          priority: 1,
        },
        {
          name: '크레아틴',
          reason: '운동 성능 향상',
          priority: 2,
        },
      ],
      summary: '활발한 운동 생활을 지원하는 영양제를 추천합니다.',
      error: null,
    };

    (
      llmService.getNutritionRecommendationWithOpenAI as jest.MockedFunction<
        typeof llmService.getNutritionRecommendationWithOpenAI
      >
    ).mockResolvedValue(mockNutritionResponse);

    await getNutritionRecommendations(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockNutritionResponse);
  });
});
