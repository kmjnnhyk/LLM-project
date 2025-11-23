# Backend API Server

영양제 추천을 위한 백엔드 API 서버입니다.

## 패키지 구조

```
src/
├── index.ts              # Express 서버 진입점
├── types.d.ts            # 백엔드 전용 타입 정의
├── routes/
│   ├── index.ts          # 라우트 설정
│   └── nutrition.ts      # 영양제 추천 API 라우트
├── middleware/
│   ├── errorHandler.ts   # 에러 핸들링 미들웨어
│   └── validateRequest.ts # 요청 검증 미들웨어
└── __tests__/
    └── routes/
        └── nutrition.test.ts  # 영양제 추천 API 테스트
```

## 설치

```bash
pnpm install
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o  # 선택적, 기본값: gpt-4o
PORT=3000            # 선택적, 기본값: 3000
NODE_ENV=production  # production 또는 development
```

**참고:** 환경 변수는 프로젝트 루트의 `.env` 파일에서 로드됩니다. 백엔드 패키지 디렉토리에 별도의 `.env` 파일을 두면 우선순위가 높습니다.

## 실행

### 개발 모드

```bash
pnpm dev
```

서버는 `http://localhost:3000`에서 실행되며, 파일 변경 시 자동으로 재시작됩니다.

### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## API 엔드포인트

### POST /api/nutrition/recommendations

영양제 추천을 받습니다.

**Request Body:**

```json
{
  "age": 30,
  "gender": "male",
  "weight": 80,
  "healthConcerns": ["digestion", "fatigue"],
  "exercise": "moderate",
  "sleepQuality": "good",
  "stressLevel": "moderate",
  "medications": "비피더스 유산균"
}
```

**필드 설명:**

- `age`: 나이 (number, 필수)
- `gender`: 성별 (`"male"` | `"female"`, 필수)
- `weight`: 체중 (number, 필수)
- `healthConcerns`: 건강 고민 배열 (string[], 필수)
  - 가능한 값: `"fatigue"`, `"digestion"`, `"immunity"`, `"sleep"`, `"stress"`, `"joint"`, `"skin"`, `"memory"`, `"other"`
- `exercise`: 운동 수준 (string, 필수)
  - 가능한 값: `"none"`, `"light"`, `"moderate"`, `"intensive"`
- `sleepQuality`: 수면의 질 (string, 필수)
  - 가능한 값: `"poor"`, `"fair"`, `"good"`, `"excellent"`
- `stressLevel`: 스트레스 수준 (string, 필수)
  - 가능한 값: `"low"`, `"moderate"`, `"high"`, `"very-high"`
- `medications`: 복용 중인 약물 (string, 필수)

**Response (200):**

```json
{
  "recommendations": [
    {
      "name": "프로바이오틱스",
      "reason": "소화불량 개선을 위해 장내 유익균을 보충하는 것이 도움이 됩니다.",
      "priority": 1,
      "dosage": "1일 1회, 1회 1정",
      "timing": "식후 30분"
    }
  ],
  "summary": "소화불량 개선을 위한 프로바이오틱스 추천",
  "warnings": ["복용 중인 약물과 함께 섭취 시 의사와 상담하세요."],
  "error": null
}
```

**Error Response (400) - Validation Error:**

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

**Error Response (400) - Invalid Response Format:**

```json
{
  "message": "영양제 추천 응답 형식이 올바르지 않습니다. 다시 시도해주세요."
}
```

**Error Response (500) - Server Error:**

```json
{
  "message": "영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
}
```

### GET /api/health

서버 상태 확인

**Response (200):**

```json
{
  "status": "ok"
}
```

## 에러 처리

### 클라이언트가 알아야 할 에러 (Production에서도 표시)

다음 에러들은 사용자에게 그대로 표시됩니다:

1. **Validation Error (400)**: 입력 데이터 검증 실패
   - 형식: `{ message: string, type: "validation_error", field: string, errors: ValidationError[] }`
   - 예: 잘못된 약물 정보, 건강 고민과 관련 없는 입력 등

2. **Invalid Response Format (400)**: 영양제 추천 응답 형식 오류
   - 형식: `{ message: string }`
   - 예: JSON 파싱 실패, 스키마 불일치 등

### 서버/인프라 에러 (Production에서 일반 메시지로 표시)

다음 에러들은 Production 환경에서는 일반적인 메시지로 변환됩니다:

- API 인증 실패 (401)
- 권한 에러 (403)
- 할당량 초과 (429)
- 서버 에러 (500+)
- 네트워크 에러

**개발 환경**에서는 상세한 에러 메시지가 표시됩니다.

### 에러 응답 형식

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "message": "에러 메시지"
}
```

Validation Error의 경우 추가 필드가 포함됩니다:

```json
{
  "message": "에러 메시지",
  "type": "validation_error",
  "field": "medications",
  "errors": [
    {
      "type": "medications",
      "message": "구체적인 에러 메시지"
    }
  ]
}
```

## 테스트

```bash
pnpm test
```

테스트는 Jest를 사용하며, `packages/configs/jest-config`의 base 설정을 사용합니다.

## 개발

### 서버 실행

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 로깅

- 개발 환경에서는 상세한 로그가 출력됩니다.
- Production 환경에서는 에러 로그만 출력됩니다.

### 환경 변수 확인

서버 시작 시 다음 정보가 출력됩니다:

- `OPENAI_API_KEY` 설정 여부
- `OPENAI_MODEL` 설정 값 (또는 기본값)

## 참고사항

- OpenAI API를 사용하여 영양제 추천을 생성합니다.
- Structured Outputs 기능을 사용하여 타입 안전한 JSON 응답을 받습니다.
- 지원하지 않는 모델을 지정하면 자동으로 `gpt-4o`로 변경됩니다.
- 모든 요청은 자동으로 검증됩니다 (Zod 스키마 사용).
- CORS가 활성화되어 있어 모든 도메인에서 접근 가능합니다.
