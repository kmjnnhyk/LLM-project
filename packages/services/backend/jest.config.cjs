/**
 * Jest Configuration for @algocare/services-backend
 * ESM 패키지용 설정
 */

const baseConfig = require('@algocare/jest-config/base.js');

module.exports = {
  ...baseConfig,
  displayName: 'services-backend',
  testEnvironment: 'node',
  // ESM 지원
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: false, // tsconfig.json 사용 안 함, 직접 설정 사용
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          skipLibCheck: true,
          target: 'ES2022',
          lib: ['ES2022'],
          resolveJsonModule: true,
          declaration: false,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@algocare/services-llm$': '<rootDir>/../llm/src',
    '^@algocare/services-backend/types$': '<rootDir>/src/types.d.ts',
    '^@algocare/utils/(.*)$': '<rootDir>/../../utils/src/$1',
    '^@algocare/(.*)$': '<rootDir>/../../$1/src',
  },
  // Express 테스트를 위한 설정
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.ts'],
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
};

