# LLM Services

영양제 추천을 위한 LLM 서비스 패키지입니다.

## 설치

```bash
pnpm add openai  # OpenAI 사용 시
```

## 패키지 구조

```
src/
├── index.ts              # 메인 export 파일
├── types.d.ts            # LLM 서비스 전용 타입 정의
├── providers/
│   └── openai.ts        # OpenAI 제공자 구현
├── prompts/
│   └── nutrition.ts     # 영양제 추천 프롬프트 빌더
└── validators/
    └── nutrition.ts     # 응답 검증 (Zod)
```

## 사용 방법

### OpenAI Structured Outputs (권장)

이 패키지는 OpenAI의 Structured Outputs 기능을 사용하여 타입 안전한 JSON 응답을 받습니다.

```typescript
import { getNutritionRecommendationWithOpenAI } from '@algocare/services-llm';
import type { OnboardingData } from '@algocare/utils/types';
import { HEALTH_CONCERN, EXERCISE_LEVEL, SLEEP_QUALITY, STRESS_LEVEL } from '@algocare/utils/enums';

const data: OnboardingData = {
  age: 30,
  gender: 'male',
  weight: 80,
  healthConcerns: [HEALTH_CONCERN.digestion, HEALTH_CONCERN.fatigue],
  exercise: EXERCISE_LEVEL.moderate,
  sleepQuality: SLEEP_QUALITY.good,
  stressLevel: STRESS_LEVEL.moderate,
  medications: '비피더스 유산균',
};

const result = await getNutritionRecommendationWithOpenAI(data, {
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4o', // 기본값: 'gpt-4o'
  temperature: 0.7, // 기본값: 0.7
  maxTokens: 2000, // 기본값: 2000
});

// result는 NutritionResponse 타입
console.log(result.recommendations); // 영양제 추천 목록
console.log(result.summary); // 전체 요약
console.log(result.warnings); // 주의사항 (선택적)
console.log(result.error); // 검증 에러 (있을 경우)
```

### 모델 자동 변경

Structured Outputs를 지원하지 않는 모델(`gpt-3.5-turbo`, `gpt-4` 등)을 지정하면 자동으로 `gpt-4o`로 변경됩니다.

```typescript
// gpt-3.5-turbo를 지정해도 자동으로 gpt-4o로 변경됨
const result = await getNutritionRecommendationWithOpenAI(data, {
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-3.5-turbo', // 자동으로 gpt-4o로 변경
});
```

## 프롬프트 커스터마이징

프롬프트를 직접 사용할 수도 있습니다:

```typescript
import {
  buildNutritionPrompt,
  buildNutritionPromptWithSchema,
  buildNutritionPromptWithExamples,
} from '@algocare/services-llm';

// 기본 프롬프트
const prompt = buildNutritionPrompt(data);

// Structured Outputs용 프롬프트 + JSON Schema
const { prompt, schema } = buildNutritionPromptWithSchema(data);

// Few-shot 예시를 포함한 프롬프트
const promptWithExamples = buildNutritionPromptWithExamples(data);
```

## 응답 검증

모든 응답은 자동으로 Zod를 사용하여 검증됩니다:

```typescript
import { validateNutritionResponse } from '@algocare/services-llm';

try {
  const result = validateNutritionResponse(rawResponse);
  // result는 NutritionResponse 타입
} catch (error) {
  if (error instanceof z.ZodError) {
    // 검증 실패 시 에러 처리
    console.error('검증 실패:', error.errors);
  }
}
```

## 에러 처리

### 클라이언트가 알아야 할 에러 (Production에서도 표시)

다음 에러들은 사용자에게 표시됩니다:

- **validation_error**: 입력 데이터 검증 실패 (예: 잘못된 약물 정보)
- **Zod 검증 에러**: LLM 응답 스키마 불일치
- **JSON 파싱 에러**: 잘못된 JSON 형식
- **빈 응답 에러**: LLM 응답이 비어있음

```typescript
try {
  const result = await getNutritionRecommendationWithOpenAI(data, options);

  // validation_error 확인
  if (result.error && result.error.length > 0) {
    result.error.forEach((err) => {
      console.error(`${err.type}: ${err.message}`);
    });
  }
} catch (error) {
  if (error instanceof z.ZodError) {
    // LLM 응답 검증 실패
    console.error('응답 형식이 올바르지 않습니다:', error.errors);
  } else if (error instanceof Error) {
    // 기타 에러
    console.error('에러:', error.message);
  }
}
```

### 서버/인프라 에러 (Production에서 일반 메시지로 표시)

다음 에러들은 Production 환경에서는 일반적인 메시지로 변환됩니다:

- API 인증 실패 (401)
- 권한 에러 (403)
- 할당량 초과 (429)
- 서버 에러 (500+)
- 네트워크 에러

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

interface NutritionRecommendation {
  name: string;
  reason: string;
  priority: number;
  dosage?: string;
  timing?: string;
}

interface ValidationError {
  type: 'healthConcerns' | 'medications';
  message: string;
}
```

## 환경 변수

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o  # 선택적, 기본값: gpt-4o
NODE_ENV=production   # production 또는 development
```

## 테스트

```bash
pnpm test
```

테스트는 Jest를 사용하며, `packages/configs/jest-config`의 base 설정을 사용합니다.

## 참고사항

- Structured Outputs는 `gpt-4o`, `gpt-4-turbo`, `gpt-4o-mini` 등의 모델만 지원합니다.
- 지원하지 않는 모델을 지정하면 자동으로 `gpt-4o`로 변경됩니다.
- 모든 응답은 Zod 스키마로 검증됩니다.
- Production 환경에서는 서버/인프라 에러만 일반 메시지로 변환되고, 클라이언트가 알아야 할 에러는 그대로 표시됩니다.
