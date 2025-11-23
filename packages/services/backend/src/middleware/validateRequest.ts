import { OnboardingDataSchema } from '@algocare/utils/validation';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { OnboardingData } from '@algocare/utils/types';

export function validateNutritionRequest(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('🔍 검증 전 데이터:', JSON.stringify(req.body, null, 2));
    const validated = OnboardingDataSchema.parse(req.body);
    console.log('✅ 검증 통과:', JSON.stringify(validated, null, 2));
    req.body = validated as OnboardingData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ 검증 실패:', error.errors);
      const firstError = error.errors[0];
      return res.status(400).json({
        message: firstError?.message || '입력 데이터가 올바르지 않습니다.',
      });
    }
    next(error);
  }
}
