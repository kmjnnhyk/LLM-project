import { z } from 'zod';
import { EXERCISE_LEVEL, HEALTH_CONCERN, SLEEP_QUALITY, STRESS_LEVEL } from './enums';
/**
 * 온보딩 데이터 스키마
 */
export const OnboardingDataSchema = z.object({
    // basic-info
    age: z
        .number({
        required_error: '나이를 입력해주세요',
        invalid_type_error: '나이는 숫자로 입력해주세요',
    })
        .int('나이는 정수로 입력해주세요')
        .min(1, '나이는 1세 이상이어야 합니다')
        .max(120, '나이는 120세 이하여야 합니다'),
    gender: z.enum(['male', 'female'], {
        required_error: '성별을 선택해주세요',
    }),
    weight: z
        .number({
        required_error: '체중을 입력해주세요',
        invalid_type_error: '체중은 숫자로 입력해주세요',
    })
        .positive('체중은 양수여야 합니다')
        .min(1, '체중은 1kg 이상이어야 합니다')
        .max(300, '체중은 300kg 이하여야 합니다'),
    // medications
    medications: z.string().max(500, '500자 이내로 입력해주세요'),
    // health-concerns
    healthConcerns: z
        .array(z.nativeEnum(HEALTH_CONCERN))
        .min(1, '건강 고민을 선택하거나 입력해주세요'),
    // lifestyle
    exercise: z.nativeEnum(EXERCISE_LEVEL, {
        required_error: '운동 여부를 선택해주세요',
    }),
    sleepQuality: z.nativeEnum(SLEEP_QUALITY, {
        required_error: '수면의 질을 선택해주세요',
    }),
    stressLevel: z.nativeEnum(STRESS_LEVEL, {
        required_error: '스트레스 수준을 선택해주세요',
    }),
});
/**
 * 영양제 추천 응답 스키마
 */
export const NutritionRecommendationSchema = z.object({
    name: z.string().min(1, '영양제 이름은 필수입니다'),
    reason: z.string().min(1, '추천 이유는 필수입니다'),
    priority: z.number().int().min(1).max(3, '우선순위는 1-3 사이여야 합니다'),
    dosage: z.string().optional(),
    timing: z.string().optional(),
});
//# sourceMappingURL=validation.js.map