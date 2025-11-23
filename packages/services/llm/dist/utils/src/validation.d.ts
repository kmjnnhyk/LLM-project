import { z } from 'zod';
import type { OnboardingData } from './types';
/**
 * 온보딩 데이터 스키마
 */
export declare const OnboardingDataSchema: z.ZodType<OnboardingData>;
/**
 * 영양제 추천 응답 스키마
 */
export declare const NutritionRecommendationSchema: z.ZodObject<{
    name: z.ZodString;
    reason: z.ZodString;
    priority: z.ZodNumber;
    dosage: z.ZodOptional<z.ZodString>;
    timing: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    reason: string;
    priority: number;
    dosage?: string | undefined;
    timing?: string | undefined;
}, {
    name: string;
    reason: string;
    priority: number;
    dosage?: string | undefined;
    timing?: string | undefined;
}>;
//# sourceMappingURL=validation.d.ts.map