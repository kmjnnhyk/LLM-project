/**
 * 영양제 추천 응답 검증
 */
import { z } from 'zod';
import { NutritionRecommendationSchema } from '@algocare/utils/validation';
const ValidationErrorSchema = z.object({
    type: z.enum(['healthConcerns', 'medications']),
    message: z.string().min(1, '에러 메시지는 필수입니다'),
});
const NutritionResponseSchema = z.object({
    recommendations: z.array(NutritionRecommendationSchema),
    summary: z.string(), // error가 있을 때는 빈 문자열도 허용
    warnings: z.array(z.string()).optional(),
    error: z.array(ValidationErrorSchema).nullable(),
});
/**
 * 영양제 추천 응답을 검증합니다.
 *
 * @param data - 검증할 데이터
 * @returns 검증된 NutritionResponse
 * @throws {z.ZodError} 검증 실패 시
 */
export function validateNutritionResponse(data) {
    const parsed = NutritionResponseSchema.parse(data);
    // OpenAI Structured Outputs는 null을 지원하지 않으므로
    // 빈 배열을 null로 변환
    return {
        ...parsed,
        error: parsed.error && parsed.error.length > 0 ? parsed.error : null,
    };
}
//# sourceMappingURL=nutrition.js.map