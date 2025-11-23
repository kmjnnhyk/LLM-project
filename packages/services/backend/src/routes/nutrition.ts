/**
 * 영양제 추천 API 라우트
 */

import type { Request, Response } from 'express';
import { z } from 'zod';
import { getNutritionRecommendationWithOpenAI } from '@algocare/services-llm';
import type { OnboardingData } from '@algocare/utils/types';

export async function getNutritionRecommendations(
  req: Request<unknown, NutritionResponse | ErrorResponse, OnboardingData>,
  res: Response<NutritionResponse | ErrorResponse>
) {
  try {
    const data = req.body;
    console.log('📥 받은 데이터:', JSON.stringify(data, null, 2));

    // LLM API 키 확인
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY가 설정되지 않았습니다.');
      return res.status(500).json({
        message: '서버 설정 오류가 발생했습니다. OPENAI_API_KEY가 설정되지 않았습니다.',
      });
    }

    // LLM을 통한 영양제 추천
    console.log('🚀 OpenAI API 호출 시작...');
    const result = await getNutritionRecommendationWithOpenAI(data, {
      apiKey: openaiApiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2000,
    });
    console.log('✅ OpenAI API 호출 성공');

    // LLM 응답의 error 필드 확인
    if (result.error && result.error.length > 0) {
      // validation_error는 항상 그대로 반환 (production에서도 표시)
      const firstError = result.error[0];

      const errorResponse = {
        message: firstError.message,
        type: 'validation_error' as const,
        field: firstError.type,
        errors: result.error,
      };

      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) {
        console.log('❌ 검증 에러 응답:', JSON.stringify(errorResponse, null, 2));
      }

      return res.status(400).json(errorResponse);
    }

    // 에러가 없는 경우 정상 응답
    return res.status(200).json(result);
  } catch (error) {
    const isDev = process.env.NODE_ENV !== 'production';

    // 개발 환경에서만 상세 에러 로깅
    if (isDev) {
      console.error('영양제 추천 오류:', error);
      console.error('에러 스택:', error instanceof Error ? error.stack : 'No stack trace');
    }

    // 클라이언트가 알아야 할 에러 (잘못된 응답 형식 등) - production에서도 그대로 표시
    // 1. Zod 검증 에러 (잘못된 응답 스키마)
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '영양제 추천 응답 형식이 올바르지 않습니다. 다시 시도해주세요.',
      });
    }

    // 2. 잘못된 응답 형식 에러 (JSON 파싱 실패, 빈 응답 등)
    if (error instanceof Error) {
      if (
        error.message.includes('영양제 추천 응답 형식이 올바르지 않습니다') ||
        error.message.includes('영양제 추천 응답이 비어있습니다')
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }
    }

    // LLM 관련 에러 처리
    if (error instanceof Error) {
      // 개발 환경에서는 상세 에러 메시지 표시
      if (isDev) {
        // OpenAI API 에러 (인증 실패, 할당량 초과 등)
        if (
          error.message.includes('API key') ||
          error.message.includes('authentication') ||
          error.message.includes('401')
        ) {
          console.error('OpenAI API 인증 실패');
          return res.status(500).json({
            message: 'API 인증에 실패했습니다. API 키를 확인해주세요.',
          });
        }

        if (
          error.message.includes('rate limit') ||
          error.message.includes('429') ||
          error.message.includes('quota')
        ) {
          console.error('OpenAI API 할당량 초과');
          return res.status(500).json({
            message: 'API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.',
          });
        }

        // 입력 정보 부족 또는 이상한 경우
        if (
          error.message.includes('입력') ||
          error.message.includes('부족') ||
          error.message.includes('필수') ||
          error.message.includes('올바르지')
        ) {
          return res.status(400).json({
            message: error.message,
          });
        }

        // 네트워크 에러
        if (
          error.message.includes('network') ||
          error.message.includes('fetch') ||
          error.message.includes('ECONNREFUSED')
        ) {
          console.error('네트워크 에러:', error.message);
          return res.status(500).json({
            message: '영양제 추천 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
          });
        }

        // 기타 에러 - 개발 환경에서는 상세 메시지
        return res.status(500).json({
          message: `영양제 추천을 생성하는 중 오류가 발생했습니다: ${error.message}`,
        });
      } else {
        // 프로덕션 환경: 서버/인프라 에러만 일반 메시지로 처리
        // (클라이언트가 알아야 할 에러는 위에서 이미 처리됨)
        return res.status(500).json({
          message: '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        });
      }
    }

    // Error 객체가 아닌 경우
    return res.status(500).json({
      message: isDev
        ? '영양제 추천을 생성하는 중 알 수 없는 오류가 발생했습니다.'
        : '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
}
