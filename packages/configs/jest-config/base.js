/**
 * Jest Base Configuration
 * 모든 패키지에서 공통으로 사용하는 Jest 설정
 */

module.exports = {
  // TypeScript 파일 처리
  preset: 'ts-jest',
  
  // 테스트 환경
  testEnvironment: 'node',
  
  // 파일 확장자 처리
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // 테스트 파일 패턴
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  
  // 변환 설정
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: false, // 기본적으로 CommonJS 사용
        tsconfig: {
          // 각 패키지의 tsconfig.json을 자동으로 사용
        },
      },
    ],
  },
  
  // 모듈 경로 매핑 (workspace 패키지 해결)
  moduleNameMapper: {
    '^@algocare/(.*)$': '<rootDir>/../../packages/$1/src',
  },
  
  // 테스트 실행 전 setup 파일
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 커버리지 설정
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
  ],
  
  // 커버리지 임계값 (선택사항)
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  
  // 무시할 경로
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
  ],
  
  // 모듈 무시 패턴
  modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/build'],
};

