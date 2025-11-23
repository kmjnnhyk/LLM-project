/**
 * Jest Configuration for @algocare/services-llm
 * ESM 패키지용 설정
 * 
 * Note: .cjs 확장자를 사용하여 CommonJS로 해석되도록 함
 * (type: "module" 패키지에서 require 사용을 위해)
 */

const baseConfig = require('@algocare/jest-config/base.js');

module.exports = {
  ...baseConfig,
  displayName: 'services-llm',
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
    '^@algocare/utils/(.*)$': '<rootDir>/../../utils/src/$1',
    '^@algocare/(.*)$': '<rootDir>/../../$1/src',
  },
};

