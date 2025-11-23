# Frontend Services

클라이언트 앱에서 사용할 서비스들을 제공합니다.

## 패키지 구조

```
src/
├── index.ts              # 메인 export 파일
├── api/
│   └── client.ts        # API 클라이언트 (get, post, put, del)
├── nutrition/
│   └── index.ts         # 영양제 추천 서비스
└── form/
    └── index.tsx        # 폼 관련 서비스
```

## 사용 방법

### 1. 영양제 추천 서비스

온보딩 데이터를 기반으로 영양제 추천을 받습니다.

```tsx
import { getNutritionRecommendations, ApiClientError } from '@algocare/services/nutrition';
import type { OnboardingData, NutritionResponse } from '@algocare/utils/types';
import { HEALTH_CONCERN, EXERCISE_LEVEL, SLEEP_QUALITY, STRESS_LEVEL } from '@algocare/utils/enums';
import { useState } from 'react';
import { Alert } from 'react-native';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
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

      const result: NutritionResponse = await getNutritionRecommendations(data);

      console.log('추천 결과:', result.recommendations);
      console.log('요약:', result.summary);
      console.log('주의사항:', result.warnings);

      // validation_error 확인
      if (result.error && result.error.length > 0) {
        result.error.forEach((err) => {
          console.warn(`${err.type}: ${err.message}`);
        });
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        Alert.alert('오류', error.message);
        console.error('API Error:', {
          message: error.message,
          status: error.status,
          type: error.type,
          field: error.field,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ...
  );
}
```

### 2. API 클라이언트 직접 사용

필요한 경우 API 클라이언트를 직접 사용할 수 있습니다.

```tsx
import { post, get, put, del, ApiClientError } from '@algocare/services/api';

// POST 요청
try {
  const data = await post<YourType>('/custom-endpoint', { key: 'value' });
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('POST Error:', error.message, error.status);
  }
}

// GET 요청
try {
  const data = await get<YourType>('/custom-endpoint');
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('GET Error:', error.message, error.status);
  }
}

// PUT 요청
try {
  const data = await put<YourType>('/custom-endpoint', { key: 'value' });
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('PUT Error:', error.message, error.status);
  }
}

// DELETE 요청
try {
  await del('/custom-endpoint');
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('DELETE Error:', error.message, error.status);
  }
}
```

## 환경 변수 설정

`.env` 파일에 API 엔드포인트를 설정합니다:

```env
EXPO_PUBLIC_API_URL=https://api.algocare.com/api
```

**기본값:**

- 개발 환경 (`__DEV__ === true`): `http://localhost:3000`
- 프로덕션 환경: `https://api.algocare.com/api`

## 에러 처리

모든 API 호출은 `ApiClientError`를 throw할 수 있습니다.

### ApiClientError 클래스

```tsx
class ApiClientError extends Error {
  message: string; // 에러 메시지
  status?: number; // HTTP 상태 코드
  type?: 'validation_error'; // 에러 타입
  field?: 'healthConcerns' | 'medications'; // 에러 필드
}
```

### 에러 처리 예시

```tsx
try {
  const result = await getNutritionRecommendations(data);
} catch (error) {
  if (error instanceof ApiClientError) {
    // error.message에는 백엔드에서 반환한 메시지가 들어있음
    // 예: "복용 중인 약물 정보가 '안녕하세요~'로 약과 전혀 관계 없습니다."
    // 예: "영양제 추천 응답 형식이 올바르지 않습니다. 다시 시도해주세요."

    // Validation Error인 경우
    if (error.type === 'validation_error') {
      console.error('검증 에러:', error.message);
      console.error('필드:', error.field);
      // 특정 필드에 대한 에러 처리
      if (error.field === 'medications') {
        // 약물 입력 필드에 에러 표시
      }
    }

    Alert.alert('오류', error.message);
    console.error('API Error:', error.message, error.status);
  } else {
    // 기타 에러 처리
    console.error('Unknown Error:', error);
  }
}
```

### 백엔드 에러 응답 형식

백엔드에서 반환하는 에러는 다음 형식을 따릅니다:

#### 일반 에러 (400, 500 등)

```json
{
  "message": "에러 메시지"
}
```

예시:

- `{ "message": "영양제 추천 응답 형식이 올바르지 않습니다. 다시 시도해주세요." }`
- `{ "message": "영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요." }`

#### Validation Error (400)

```json
{
  "message": "복용 중인 약물 정보가 '안녕하세요~'로 약과 전혀 관계 없습니다.",
  "type": "validation_error",
  "field": "medications",
  "errors": [
    {
      "type": "medications",
      "message": "복용 중인 약물 정보가 '안녕하세요~'로 약과 전혀 관계 없습니다."
    }
  ]
}
```

## 타입 정의

모든 타입은 TypeScript로 정의되어 있어 타입 안정성을 보장합니다.

### OnboardingData

```tsx
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
```

### NutritionResponse

```tsx
import type { NutritionResponse, NutritionRecommendation } from '@algocare/utils/types';

const result: NutritionResponse = await getNutritionRecommendations(data);

// result.recommendations: NutritionRecommendation[]
// result.summary: string
// result.warnings?: string[]
// result.error: ValidationError[] | null
```

### Enum 값

```tsx
import { HEALTH_CONCERN, EXERCISE_LEVEL, SLEEP_QUALITY, STRESS_LEVEL } from '@algocare/utils/enums';

// HEALTH_CONCERN: 'fatigue' | 'digestion' | 'immunity' | 'sleep' | 'stress' | 'joint' | 'skin' | 'memory' | 'other'
// EXERCISE_LEVEL: 'none' | 'light' | 'moderate' | 'intensive'
// SLEEP_QUALITY: 'poor' | 'fair' | 'good' | 'excellent'
// STRESS_LEVEL: 'low' | 'moderate' | 'high' | 'very-high'
```

## 네트워크 에러 처리

네트워크 연결 실패 시 자동으로 처리됩니다:

```tsx
try {
  const result = await getNutritionRecommendations(data);
} catch (error) {
  if (error instanceof ApiClientError && error.status === 0) {
    // 네트워크 연결 실패
    Alert.alert('연결 실패', '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
  }
}
```

## 참고사항

- 모든 API 요청은 자동으로 JSON 형식으로 직렬화/역직렬화됩니다.
- 개발 환경에서는 상세한 로그가 콘솔에 출력됩니다.
- CORS가 활성화되어 있어 모든 도메인에서 접근 가능합니다.
- 타입 안정성을 위해 TypeScript를 사용하는 것을 권장합니다.
