/**
 * Jest Configuration for ESM packages
 * type: "module" 패키지용 설정
 */

const baseConfig = require('./base.js');

module.exports = {
  ...baseConfig,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          // 각 패키지의 tsconfig.json을 자동으로 사용
        },
      },
    ],
  },
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    // ESM 모듈 해결을 위한 추가 매핑
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};

