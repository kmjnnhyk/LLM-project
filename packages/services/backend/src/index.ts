/**
 * 백엔드 API 서버
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

// 환경 변수 로드 (프로젝트 루트의 .env 파일)
// tsx를 사용할 때는 process.cwd()가 실행 디렉토리를 반환하므로,
// packages/services/backend에서 실행되면 그 디렉토리가 cwd가 됩니다.
// 따라서 루트로 가려면 ../../.. 를 해야 합니다.
// packages/services/backend -> packages/services -> packages -> 루트
const rootEnvPath = path.resolve(process.cwd(), '../../..', '.env');

// 루트의 .env 파일을 먼저 로드
const rootResult = dotenv.config({ path: rootEnvPath });
if (rootResult.error) {
  const error = rootResult.error as Error & { code?: string };
  if (error.code === 'ENOENT') {
    console.warn(`⚠️  루트 .env 파일을 찾을 수 없습니다: ${rootEnvPath}`);
  } else {
    console.warn(`⚠️  루트 .env 파일 로드 실패: ${error.message}`);
  }
} else {
  console.log(`✅ 루트 .env 파일 로드 성공: ${rootEnvPath}`);
}

// 현재 디렉토리의 .env도 로드 (백엔드 전용 설정이 있을 경우, 우선순위 높음)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
setupRoutes(app);

// 에러 핸들링 미들웨어 (가장 마지막에)
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📝 환경 변수 확인:`);
  console.log(`   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '설정됨' : '설정되지 않음'}`);
  console.log(`   - OPENAI_MODEL: ${process.env.OPENAI_MODEL || 'gpt-3.5-turbo (기본값)'}`);
});
