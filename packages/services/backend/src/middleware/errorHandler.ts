/**
 * 에러 핸들링 미들웨어
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  // Zod 검증 에러
  if (error instanceof ZodError) {
    const firstError = error.errors[0];
    return res.status(400).json({
      message: firstError?.message || '입력 데이터가 올바르지 않습니다.',
    });
  }

  // 기타 에러
  console.error('API Error:', error);
  return res.status(500).json({
    message: error.message || '서버 오류가 발생했습니다.',
  });
}
