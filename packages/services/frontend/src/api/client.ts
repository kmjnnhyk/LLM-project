/**
 * API 클라이언트 기본 설정
 * 환경 변수나 설정에 따라 API 엔드포인트를 관리합니다.
 */

// 개발 환경에서는 localhost:3000, 프로덕션에서는 환경 변수 또는 기본값 사용
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (typeof __DEV__ !== 'undefined' && __DEV__
    ? 'http://localhost:3000'
    : 'https://api.algocare.com/api');

/**
 * API 에러 응답 형식
 * 백엔드에서 반환하는 에러는 항상 이 형식을 따릅니다.
 */
export interface ApiError {
  message: string;
  type?: 'validation_error';
  field?: 'healthConcerns' | 'medications';
}

export class ApiClientError extends Error {
  status?: number;
  type?: 'validation_error';
  field?: 'healthConcerns' | 'medications';

  constructor(
    message: string,
    status?: number,
    type?: 'validation_error',
    field?: 'healthConcerns' | 'medications'
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.type = type;
    this.field = field;
  }
}

/**
 * API 요청 기본 함수
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('🌐 API 요청:', url, options.method || 'GET');

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // 세션 토큰이 있다면 추가 (필요시)
  // const session = await getSession();
  // if (session) {
  //   defaultHeaders['Authorization'] = `Bearer ${session}`;
  // }

  let response: Response;
  try {
    console.log('🌐 fetch 호출 전');
    response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    console.log('🌐 fetch 호출 후', response.status, response.statusText);
  } catch (error) {
    // 네트워크 에러 (연결 실패 등)
    const errorMessage =
      error instanceof Error ? error.message : '네트워크 연결에 실패했습니다.';
    console.error('🔴 API 요청 네트워크 에러:', error);
    throw new ApiClientError(
      `서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요. (${errorMessage})`,
      0
    );
  }

  if (!response.ok) {
    // 백엔드에서 반환하는 에러 형식: { message: string, type?: string, field?: string }
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'API 요청에 실패했습니다.',
    }));

    // 에러 응답 형식 검증 및 추출
    const errorMessage =
      typeof errorData === 'object' && errorData !== null && 'message' in errorData
        ? String(errorData.message)
        : response.statusText || 'API 요청에 실패했습니다.';

    const errorType =
      typeof errorData === 'object' && errorData !== null && 'type' in errorData
        ? (errorData.type as 'validation_error' | undefined)
        : undefined;

    const errorField =
      typeof errorData === 'object' && errorData !== null && 'field' in errorData
        ? (errorData.field as 'healthConcerns' | 'medications' | undefined)
        : undefined;

    console.error('🔴 API 에러 응답:', {
      status: response.status,
      statusText: response.statusText,
      url,
      errorMessage,
      errorType,
      errorField,
      rawErrorData: errorData,
    });

    throw new ApiClientError(errorMessage, response.status, errorType, errorField);
  }

  console.log('🌐 응답 파싱 전');
  const result = await response.json();
  console.log('🌐 응답 파싱 후', result);
  return result;
}

/**
 * GET 요청
 */
export async function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

/**
 * POST 요청
 */
export async function post<T>(endpoint: string, data?: unknown): Promise<T> {
  console.log('📤 POST 요청:', endpoint, data);
  return request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 요청
 */
export async function put<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 요청
 */
export async function del<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}
