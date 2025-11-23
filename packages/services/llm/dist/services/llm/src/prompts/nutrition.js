/**
 * 영양제 추천 프롬프트 템플릿
 */
import { HEALTH_CONCERN, EXERCISE_LEVEL, SLEEP_QUALITY, STRESS_LEVEL } from '@algocare/utils/enums';
/**
 * 건강 고민 enum 값을 한국어 레이블로 변환
 */
function getHealthConcernLabel(value) {
    const labels = {
        [HEALTH_CONCERN.fatigue]: '피로',
        [HEALTH_CONCERN.digestion]: '소화불량',
        [HEALTH_CONCERN.immunity]: '면역력 저하',
        [HEALTH_CONCERN.sleep]: '수면 문제',
        [HEALTH_CONCERN.stress]: '스트레스',
        [HEALTH_CONCERN.joint]: '관절 건강',
        [HEALTH_CONCERN.skin]: '피부 건강',
        [HEALTH_CONCERN.memory]: '기억력',
        [HEALTH_CONCERN.other]: '기타',
    };
    return labels[value] || value;
}
/**
 * 운동 수준 enum 값을 한국어 레이블로 변환
 */
function getExerciseLabel(value) {
    const labels = {
        [EXERCISE_LEVEL.none]: '운동하지 않음',
        [EXERCISE_LEVEL.light]: '가벼운 운동 (주 1-2회)',
        [EXERCISE_LEVEL.moderate]: '보통 운동 (주 3-4회)',
        [EXERCISE_LEVEL.intensive]: '격렬한 운동 (주 5회 이상)',
    };
    return labels[value] || value;
}
/**
 * 수면의 질 enum 값을 한국어 레이블로 변환
 */
function getSleepQualityLabel(value) {
    const labels = {
        [SLEEP_QUALITY.poor]: '나쁨',
        [SLEEP_QUALITY.fair]: '보통',
        [SLEEP_QUALITY.good]: '좋음',
        [SLEEP_QUALITY.excellent]: '매우 좋음',
    };
    return labels[value] || value;
}
/**
 * 스트레스 수준 enum 값을 한국어 레이블로 변환
 */
function getStressLevelLabel(value) {
    const labels = {
        [STRESS_LEVEL.low]: '낮음',
        [STRESS_LEVEL.moderate]: '보통',
        [STRESS_LEVEL.high]: '높음',
        [STRESS_LEVEL.veryHigh]: '매우 높음',
    };
    return labels[value] || value;
}
/**
 * 온보딩 데이터를 기반으로 영양제 추천 프롬프트를 생성합니다.
 */
export function buildNutritionPrompt(data) {
    const healthConcernsText = data.healthConcerns
        .map((concern) => {
        const enumValue = Object.values(HEALTH_CONCERN).find((v) => v === concern);
        return enumValue ? getHealthConcernLabel(enumValue) : concern;
    })
        .join(', ');
    return `
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
}
/**
 * JSON Schema를 포함한 프롬프트 (Structured Outputs용)
 */
export function buildNutritionPromptWithSchema(data) {
    return {
        prompt: buildNutritionPrompt(data),
        schema: {
            type: 'object',
            properties: {
                recommendations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            reason: { type: 'string' },
                            priority: { type: 'number', enum: [1, 2, 3] },
                            dosage: { type: 'string' },
                            timing: { type: 'string' },
                        },
                        required: ['name', 'reason', 'priority', 'dosage', 'timing'],
                        additionalProperties: false,
                    },
                },
                summary: { type: 'string' },
                warnings: {
                    type: 'array',
                    items: { type: 'string' },
                },
                error: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['healthConcerns', 'medications'] },
                            message: { type: 'string' },
                        },
                        required: ['type', 'message'],
                        additionalProperties: false,
                    },
                },
            },
            required: ['recommendations', 'summary', 'warnings', 'error'],
            additionalProperties: false,
        },
    };
}
/**
 * Few-shot 예시를 포함한 프롬프트
 */
export function buildNutritionPromptWithExamples(data) {
    const basePrompt = buildNutritionPrompt(data);
    return `
${basePrompt}

## 예시

예시 1:
입력: {"age": 30, "gender": "male", "healthConcerns": ["digestion"], "exercise": "none", "sleepQuality": "good", "stressLevel": "low", "medications": "", "weight": 80}
출력: {
  "recommendations": [
    {
      "name": "프로바이오틱스",
      "reason": "소화불량 개선을 위해 장내 유익균을 보충하는 것이 필요합니다.",
      "priority": 1,
      "dosage": "1일 1회, 1회 1정",
      "timing": "식후 30분"
    }
  ],
  "summary": "소화불량 개선을 위한 프로바이오틱스 추천",
  "warnings": [],
  "error": null
}

예시 2:
입력: {"age": 25, "gender": "female", "healthConcerns": ["stress", "sleep"], "exercise": "moderate", "sleepQuality": "poor", "stressLevel": "high", "medications": "", "weight": 60}
출력: {
  "recommendations": [
    {
      "name": "마그네슘",
      "reason": "스트레스 완화와 수면의 질 개선에 도움이 됩니다.",
      "priority": 1,
      "dosage": "1일 1회, 1회 1정",
      "timing": "취침 전"
    },
    {
      "name": "비타민 B 복합체",
      "reason": "스트레스 관리와 에너지 대사에 필수적입니다.",
      "priority": 2,
      "dosage": "1일 1회, 1회 1정",
      "timing": "아침 식후"
    }
  ],
  "summary": "스트레스와 수면 문제 개선을 위한 마그네슘과 비타민 B 복합체 추천",
  "warnings": [],
  "error": null
}

예시 3 (에러 케이스):
입력: {"age": 30, "gender": "male", "healthConcerns": ["test"], "exercise": "none", "sleepQuality": "good", "stressLevel": "low", "medications": "안녕하세요 김진혁입니다", "weight": 80}
출력: {
  "recommendations": [],
  "summary": "",
  "warnings": [],
  "error": [
    {
      "type": "healthConcerns",
      "message": "입력하신 건강 고민이 실제 건강 문제와 관련이 없습니다. 올바른 건강 고민을 선택해주세요."
    },
    {
      "type": "medications",
      "message": "복용 중인 약물 정보가 약과 관련이 없는 내용입니다. 실제 복용 중인 약물이나 영양제 이름을 입력해주세요."
    }
  ]
}

예시 4 (medications 정상 케이스):
입력: {"age": 30, "gender": "male", "healthConcerns": ["fatigue"], "exercise": "moderate", "sleepQuality": "good", "stressLevel": "low", "medications": "비타민 C, 아르기닌", "weight": 80}
출력: {
  "recommendations": [
    {
      "name": "마그네슘",
      "reason": "피로 개선과 운동 후 회복에 도움이 됩니다.",
      "priority": 1,
      "dosage": "1일 1회, 1회 1정",
      "timing": "취침 전"
    }
  ],
  "summary": "피로 개선을 위한 마그네슘 추천",
  "warnings": ["비타민 C와 아르기닌을 복용 중이시므로, 새로운 영양제 추가 시 상호작용을 고려해야 합니다."],
  "error": null
}

위 예시를 참고하여 사용자 정보를 분석해주세요.
`;
}
//# sourceMappingURL=nutrition.js.map