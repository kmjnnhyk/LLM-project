# Utils

모든 패키지에서 공통으로 사용하는 유틸리티, 타입, enum, 검증 스키마를 제공합니다.

## 패키지 구조

```
src/
├── enums.ts        # 공통 enum 정의
├── types.ts        # 공통 타입 정의
└── validation.ts   # Zod 검증 스키마
```

## 설치

이 패키지는 workspace 내부 패키지이므로 별도 설치가 필요 없습니다.

## 사용 방법

### Enum 사용

```typescript
import { HEALTH_CONCERN, EXERCISE_LEVEL, SLEEP_QUALITY, STRESS_LEVEL } from '@algocare/utils/enums';

// 건강 고민
const concerns: HEALTH_CONCERN[] = [HEALTH_CONCERN.digestion, HEALTH_CONCERN.fatigue];

// 운동 수준
const exercise = EXERCISE_LEVEL.moderate;

// 수면의 질
const sleep = SLEEP_QUALITY.good;

// 스트레스 수준
const stress = STRESS_LEVEL.moderate;
```

**사용 가능한 Enum 값:**

- `HEALTH_CONCERN`: `'fatigue'`, `'digestion'`, `'immunity'`, `'sleep'`, `'stress'`, `'joint'`, `'skin'`, `'memory'`, `'other'`
- `EXERCISE_LEVEL`: `'none'`, `'light'`, `'moderate'`, `'intensive'`
- `SLEEP_QUALITY`: `'poor'`, `'fair'`, `'good'`, `'excellent'`
- `STRESS_LEVEL`: `'low'`, `'moderate'`, `'high'`, `'very-high'`

### 타입 사용

```typescript
import type { OnboardingData, NutritionResponse, NutritionRecommendation } from '@algocare/utils/types';

// 온보딩 데이터
const data: OnboardingData = {
  age: 30,
  gender: 'male',
  weight: 80,
  healthConcerns: [HEALTH_CONCERN.digestion],
  exercise: EXERCISE_LEVEL.moderate,
  sleepQuality: SLEEP_QUALITY.good,
  stressLevel: STRESS_LEVEL.moderate,
  medications: '비피더스 유산균',
};

// 영양제 추천 응답
const response: NutritionResponse = {
  recommendations: [
    {
      name: '프로바이오틱스',
      reason: '소화불량 개선',
      priority: 1,
      dosage: '1일 1회',
      timing: '식후 30분',
    },
  ],
  summary: '소화불량 개선을 위한 프로바이오틱스 추천',
  warnings: [],
  error: null,
};
```

### 검증 스키마 사용

```typescript
import { OnboardingDataSchema, NutritionRecommendationSchema } from '@algocare/utils/validation';
import { z } from 'zod';

// 온보딩 데이터 검증
try {
  const validated = OnboardingDataSchema.parse(data);
  // 검증 성공
} catch (error) {
  if (error instanceof z.ZodError) {
    // 검증 실패
    console.error(error.errors);
  }
}

// 안전한 검증 (에러를 throw하지 않음)
const result = OnboardingDataSchema.safeParse(data);
if (result.success) {
  // 검증 성공
  const validated = result.data;
} else {
  // 검증 실패
  console.error(result.error.errors);
}
```

## 타입 정의

### OnboardingData

```typescript
interface OnboardingData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  healthConcerns: HEALTH_CONCERN[];
  exercise: EXERCISE_LEVEL;
  sleepQuality: SLEEP_QUALITY;
  stressLevel: STRESS_LEVEL;
  medications: string;
}
```

### NutritionResponse

```typescript
interface NutritionResponse {
  recommendations: NutritionRecommendation[];
  summary: string;
  warnings?: string[];
  error: ValidationError[] | null;
}
```

### NutritionRecommendation

```typescript
interface NutritionRecommendation {
  name: string;
  reason: string;
  priority: number;
  dosage?: string;
  timing?: string;
}
```

### ValidationError

```typescript
interface ValidationError {
  type: 'healthConcerns' | 'medications';
  message: string;
}
```

## 검증 규칙

### OnboardingDataSchema

- `age`: 1-120 사이의 정수
- `gender`: `'male'` 또는 `'female'`
- `weight`: 1-300 사이의 양수
- `medications`: 최대 500자
- `healthConcerns`: 최소 1개 이상 선택
- `exercise`, `sleepQuality`, `stressLevel`: 각각의 enum 값

### NutritionRecommendationSchema

- `name`: 최소 1자 이상
- `reason`: 최소 1자 이상
- `priority`: 1-3 사이의 정수
- `dosage`, `timing`: 선택적

## 주의사항

- 이 패키지의 타입은 **2개 이상의 패키지에서 공통으로 사용하는 타입**만 정의합니다.
- 패키지 전용 타입은 각 패키지의 `types.d.ts`에 정의해야 합니다.
- 타입을 변경할 때는 모든 패키지에 영향을 미칠 수 있으므로 주의해야 합니다.

## 관련 문서

- [Zod 문서](https://zod.dev/)
- [TypeScript 문서](https://www.typescriptlang.org/)

