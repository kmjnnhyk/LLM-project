# 결과물
https://github.com/user-attachments/assets/21e21afd-bb45-4565-b44e-c03a01ce849a

# 작업 환경

### `root`
- `turbo`를 이용한 모노레포 분리
- 주 라이브러리 : **turbo** (`^1.13.4`)

### `apps/client`
- React-Native(Expo)를 이용하여 ios, android 두 플랫폼 동시 개발 가능한 크로스플랫폼 앱 제작했습니다.
- 주 라이브러리 : **expo** (`~53.0.23`)

### `packages/services/backend`
- `packages/services/llm`에서 구현된 LLM을 클라이언트로 제공하기 위하여 서버 api 포인트를 만드는 간단한 백엔드 패키지를 express를 이용하여 구현했습니다.  
- 주 라이브러리 : **express** (`^4.18.2`) : Node.js 웹 프레임워크

### `packages/services/frontend`
- 클라이언트 단에서 사용하는 form, 서버 request 등의 서비스 로직을 정리했습니다.
- 주 라이브러리 : **react-hook-form** (`^7.48.2`) - 폼 상태 관리 라이브러리

### `packages/services/llm`
- 클라이언트에서 수집한 유저의 정보를 바탕으로 자동으로 프롬프트를 생성하고 openAI를 이용하여 응답을 받아 구조화된 응답을 반환하는 함수를 제작했습니다.
- 주 라이브러리 : **openai** (`^4.28.0`) - OpenAI API 클라이언트 SDK

### `packages/utils`
- 모든 패키지들에서 사용하는 타입들과 유효성을 utils로 정리헀습니다.
- 주 라이브러리 : **zod** (`^3.22.4`) - 공통 타입 및 검증 스키마 정의

### `packages/design-system`
- `nativewind` 기반의 컴포넌트 라이브러리 `gluestack`을 이용하여 간단하게 디자인 시스템을 정의했습니다.
- 주 라이브러리 : **@gluestack-ui/** - 웹 & 모바일 동시 사용 가능한 UI 컴포넌트 라이브러리

# 실행 방법
1. openAI에서 'sk~'로 시작하는 api key를 발급받아 .env.example을 참고하여 환경 변수를 주입합니다.
2. 원하는 플랫폼(`ios` or `android`)에 따라 루트에서 `pnpm ios` or `pnpm android`를 실행합니다. (⚠️ios, android 에뮬레이터 설치되어있어야 함)
3. 빌드가 끝나면 클라이언트 expo 서버(client)는 자동으로 시작되고, 백엔드 서버는 루트에서 `pnpm dev:server`를 이용하여 실행해줍니다.
4. 만약 나중에 다시 실행한다하면 루트에서 `pnpm dev` 명령어로 클라이언트 서버 및 백엔드 동시에 실행할 수 있습니다.
5. 구현한 테스트들은 루트에서 `pnpm test` 명령어로 백엔드 및 LLM 로직을 검증할 수 있습니다.

# 전체적인 로직
참고로 자세한 코드에 대한 설명은 각 패키지 README.md에 정리해놓았으니 전체적인 작업 로직만 설명드리려고 합니다.

## 클라이언트 앱 (apps/client)
먼저 클라이언트에서는 OnboardingData 타입과 같은 form 데이터를 수집합니다. OnboardingDataSchema를 서버단에서도 사용하지만 사용자에게 앱을 사용하는 화면에서 즉각적으로도 보여주기 위해 OnboardingDataSchema를 react-hook-form에 zod resolver를 이용하여 이중으로 유효성 검사를 하게 됩니다.
최종 온보딩 단계에서 유저에게 수집한 정보를 frontend단의 서버 API인 getNutritionRecommendations에 props로 담아 전달하고 받은 응답의 에러코드가 있다면 토스트로 어떤 곳이 잘못되었는지, 잘 응답이 왔다면 결과창으로 이동하여 추천 영양제들을 보여줍니다.
클라이언트, 백엔드, LLM이 통일된 타입을 쓰기 위해, 그리고 나중에 프롬프트로 변환하기 쉽게 enum을 이용하기도 했습니다.
```typescript
// packages/utils/src/types.ts
export interface OnboardingData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  healthConcerns: HEALTH_CONCERN[];
  exercise: EXERCISE_LEVEL;
  sleepQuality: SLEEP_QUALITY;
  stressLevel: STRESS_LEVEL;
  medications: string;
}

// packages/utils/validation.ts
export const OnboardingDataSchema: z.ZodType<OnboardingData> = z.object({
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
```

## 클라이언트 서버 (packages/services/frontend/api)
클라이언트 서버에서는 현재 백엔드에서 실행되고 있는 서버 API 엔드 포인트로 간단하게 fetch를 이용하여 request를 보냅니다. (추후 react-query나 graphql을 도입할 수 있게 frontend/api로 분리했습니다.)

## 백엔드 서버 (packages/services/backend)
port 3000번에 간단하게 express를 이용하여 백엔드 서버를 띄웁니다. `api/nutrition/recommendations` 경로에서 온보딩에서 받아온 데이터(`req`)를 가지고 openAI api에게 요청하여 응답(`res`)을 받아옵니다.
openAI api는 `packages/services/llm`에 정리되어있고 도착한 response를 분석하여 성공했으면 200 코드와 함께 응답을 클라이언트에게 보냅니다. 만약 실패했으면 그 에러 코드에 따라 클라이언트에게 어떤 에러를 보여줄지 한 번 정리합니다. 다만 openAI 토큰 사용량 같은 에러는 DEV 환경에서만 보이게 처리했고 클라이언트는
서버 에러로 보이게 처리했습니다.

## LLM (packages/services/llm)
llm 패키지에는 받아온 데이터를 가지고 프롬프트를 만드는 부분과 llm을 제공하는 provider(현재는 openAI를 이용하지만 언제든 Claude 등 다른 LLM을 이용할 수 있음), 그리고 유효성 검사 부분으로 나뉩니다.
스키마에 맞춰져있는 OnboardingData를 가지고 문장화하여 프롬프트 요청을 보냅니다. 응답은 Few-shot 방법을 이용하여 올바른 예시 및 에러 예시를 직접 제공하여 규격화된 json 형태의 값을 제공받도록 했습니다.
```
당신은 영양제 추천 전문가입니다. 다음 사용자 정보를 분석하여 맞춤형 영양제를 추천해주세요.

## 사용자 정보
- 나이: ${data.age}세
- 성별: ${data.gender === 'male' ? '남성' : '여성'}
- 체중: ${data.weight}kg
- 건강 고민: ${healthConcernsText || '없음'}
- 운동 수준: ${getExerciseLabel(data.exercise)}
- 수면의 질: ${getSleepQualityLabel(data.sleepQuality)}
- 스트레스 수준: ${getStressLevelLabel(data.stressLevel)}
- 복용 중인 약물: ${data.medications || '없음'}

## 추천 기준
1. 사용자의 건강 고민에 직접적으로 도움이 되는 영양제 우선 추천
2. 운동 수준과 생활 패턴을 고려한 영양제 선택
3. 복용 중인 약물과의 상호작용 고려
4. 나이와 성별에 맞는 영양제 추천
5. 우선순위가 높은 영양제부터 추천 (priority: 1이 가장 높음)

## 데이터 검증
사용자가 입력한 데이터를 먼저 검증해주세요:
1. **healthConcerns**: 건강 고민이 실제 건강 문제와 관련이 있는지, 상관없는 내용(예: "테스트", "123", "없음" 등)이 포함되어 있는지 확인
2. **medications**: 복용 중인 약물 정보가 약과 전혀 관계 없는 내용인지 확인
   - ✅ 허용: 실제 약물 이름, 영양제 이름, 보조제 이름, 건강기능식품 이름 등 (예: "아르기닌", "비타민 C", "프로바이오틱스", "오메가3", "타이레놀", "아스피린" 등)
   - ❌ 에러 처리: 약과 전혀 관계 없는 내용만

문제가 있는 경우:
- 해당 필드의 type과 구체적인 문제 이유를 message에 작성
- error 배열에 추가
- recommendations는 빈 배열로 반환 가능

문제가 없는 경우:
- error는 빈 배열([])로 설정

## 응답 형식
반드시 다음 JSON 형식으로만 응답해주세요. 다른 설명이나 주석은 포함하지 마세요.

{
  "recommendations": [
    {
      "name": "영양제 이름",
      "reason": "이 사용자에게 추천하는 구체적인 이유",
      "priority": 1,
      "dosage": "권장 복용량 (예: 1일 1회, 1회 1정)",
      "timing": "복용 시기 (예: 식후 30분, 취침 전)"
    }
  ],
  "summary": "전체 추천 요약 (2-3문장)",
  "warnings": ["주의사항이 있다면 배열로 작성, 없으면 빈 배열"],
  "error": [
    {
      "type": "healthConcerns" 또는 "medications",
      "message": "문제가 있는 구체적인 이유"
    }
  ] (문제가 없으면 빈 배열 [])
}

중요: JSON만 응답하고 다른 텍스트는 포함하지 마세요.
`;
```

# 테스트
클라이언트 앱에선 현재 react-hook-form과 zod를 이용한 유효성 검사로 촘촘히 잘못된 부분을 잡고있기 때문에, 일단 백엔드와 llm에만 테스트를 각각 넣어봤습니다.
llm에서의 테스트는 잘못된 request가 올 때 어떻게 응답이오는지 체크하고 있고 백엔드에서는 클라이언트로부터 극단적인 데이터가 왔을떄도 잘 보여주는지 여러 케이스(최소 나이와 체중, 많은 양의 복용 약물 및 걱정들)로 테스트를 진행합니다.
