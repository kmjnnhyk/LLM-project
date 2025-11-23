/**
 * OpenAI LLM 제공자 구현
 */
import OpenAI from 'openai';
import { z } from 'zod';
import { buildNutritionPromptWithSchema } from '../prompts/nutrition';
import { validateNutritionResponse } from '../validators/nutrition';
/**
 * OpenAI를 사용하여 영양제 추천을 받습니다.
 *
 * @param data - 온보딩 데이터
 * @param options - OpenAI 설정 옵션
 * @returns 영양제 추천 결과
 */
export async function getNutritionRecommendationWithOpenAI(data, options) {
    const openai = new OpenAI({
        apiKey: options.apiKey,
    });
    let model = options.model || 'gpt-4o';
    const originalModel = model; // 원래 모델명 저장 (에러 메시지용)
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 2000;
    // Structured Outputs를 지원하지 않는 모델 목록
    const unsupportedModels = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k'];
    // 모델이 Structured Outputs를 지원하지 않으면 gpt-4o로 변경
    if (unsupportedModels.includes(model)) {
        const isDev = process.env.NODE_ENV !== 'production';
        if (isDev) {
            console.warn(`⚠️  모델 ${model}은 Structured Outputs를 지원하지 않습니다. gpt-4o로 자동 변경합니다.`);
        }
        model = 'gpt-4o';
    }
    try {
        const { prompt, schema } = buildNutritionPromptWithSchema(data);
        const response = await openai.chat.completions.create({
            model,
            messages: [
                {
                    role: 'system',
                    content: '당신은 영양제 추천 전문가입니다. 사용자 정보를 분석하여 맞춤형 영양제를 추천합니다.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature,
            max_tokens: maxTokens,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'nutrition_recommendation',
                    schema: schema,
                    strict: true,
                },
            },
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('영양제 추천 응답이 비어있습니다.');
        }
        const parsed = JSON.parse(content);
        return validateNutritionResponse(parsed);
    }
    catch (error) {
        const isDev = process.env.NODE_ENV !== 'production';
        // 에러 로깅 (개발 환경에서만)
        if (isDev) {
            console.error('=== OpenAI API 에러 상세 ===');
            console.error('에러 타입:', typeof error);
            console.error('에러 생성자:', error?.constructor?.name);
            console.error('에러 메시지:', error instanceof Error ? error.message : String(error));
            console.error('에러 전체:', error);
            if (error && typeof error === 'object') {
                console.error('에러 속성들:', Object.keys(error));
                console.error('status 속성:', error.status);
                console.error('code 속성:', error.code);
                console.error('type 속성:', error.type);
            }
            console.error('==========================');
        }
        // 클라이언트가 알아야 할 에러 (잘못된 응답 형식 등) - production에서도 그대로 표시
        // 1. Zod 검증 에러 (잘못된 응답 스키마)
        if (error instanceof z.ZodError) {
            // Zod 에러는 그대로 전달 (backend에서 처리)
            throw error;
        }
        // 2. JSON 파싱 에러 (잘못된 JSON 형식)
        if (error instanceof SyntaxError || (error instanceof Error && error.name === 'SyntaxError')) {
            throw new Error('영양제 추천 응답 형식이 올바르지 않습니다. 다시 시도해주세요.');
        }
        // 3. 영양제 추천 응답이 비어있는 경우
        if (error instanceof Error && error.message === '영양제 추천 응답이 비어있습니다.') {
            throw new Error('영양제 추천 응답이 비어있습니다. 다시 시도해주세요.');
        }
        // OpenAI SDK 에러 처리
        // OpenAI SDK는 APIError를 던지는데, 이는 status 속성을 가집니다
        if (error && typeof error === 'object') {
            const apiError = error;
            // 인증 에러 (401) 또는 인증 관련 메시지
            if (apiError.status === 401 ||
                (apiError.message &&
                    (apiError.message.includes('401') ||
                        apiError.message.includes('authentication') ||
                        apiError.message.includes('Invalid API key') ||
                        apiError.message.includes('Incorrect API key')))) {
                throw new Error(isDev
                    ? 'OpenAI API 인증에 실패했습니다. API 키를 확인해주세요.'
                    : '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            // 권한 에러 (403)
            if (apiError.status === 403) {
                throw new Error(isDev
                    ? 'OpenAI API 접근 권한이 없습니다. API 키와 모델 접근 권한을 확인해주세요.'
                    : '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            // 할당량 초과 (429)
            if (apiError.status === 429) {
                throw new Error(isDev
                    ? 'OpenAI API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.'
                    : '영양제 추천 서비스가 일시적으로 사용량이 많습니다. 잠시 후 다시 시도해주세요.');
            }
            // 서버 에러 (500, 502, 503, 504)
            if (apiError.status && apiError.status >= 500) {
                throw new Error(isDev
                    ? `OpenAI 서버 오류가 발생했습니다. (${apiError.status}) 잠시 후 다시 시도해주세요.`
                    : '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            // Structured Outputs 미지원 모델 에러 (400)
            // (이 에러는 모델 자동 변경 후에도 발생할 수 있으므로, 원래 모델명을 표시)
            if (apiError.status === 400 &&
                apiError.message &&
                apiError.message.includes('json_schema') &&
                apiError.message.includes('not supported')) {
                throw new Error(isDev
                    ? `현재 모델(${originalModel})은 Structured Outputs를 지원하지 않습니다. gpt-4o, gpt-4-turbo, gpt-4o-mini 등의 모델을 사용해주세요.`
                    : '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            // 기타 API 에러 - 메시지가 있으면 사용
            if (apiError.message) {
                throw new Error(isDev
                    ? `OpenAI API 오류: ${apiError.message}`
                    : '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        }
        // 일반 Error 객체
        if (error instanceof Error) {
            // 인증 관련 메시지가 포함되어 있으면
            if (error.message.includes('401') ||
                error.message.includes('authentication') ||
                error.message.includes('Invalid API key') ||
                error.message.includes('Incorrect API key')) {
                throw new Error(isDev
                    ? 'OpenAI API 인증에 실패했습니다. API 키를 확인해주세요.'
                    : '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            // 개발 환경이 아니면 일반적인 에러 메시지로 변환
            if (!isDev) {
                throw new Error('영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            throw error;
        }
        throw new Error(isDev
            ? '알 수 없는 오류가 발생했습니다.'
            : '영양제 추천 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
}
//# sourceMappingURL=openai.js.map