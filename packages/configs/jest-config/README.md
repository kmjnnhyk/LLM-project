# Jest Config

AlgoCare 프로젝트의 공통 Jest 설정입니다. 모든 패키지에서 공통으로 사용하는 Jest base 설정을 제공합니다.

## 설치

이 패키지는 workspace 내부 패키지이므로 별도 설치가 필요 없습니다.

## 사용 방법

### ESM 패키지 (예: services/llm, services/backend)

`jest.config.cjs` 파일 생성:

```javascript
const baseConfig = require('@algocare/jest-config/base.js');

module.exports = {
  ...baseConfig,
  displayName: 'my-package',
  // 패키지별 추가 설정
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true, // ESM 패키지인 경우
        tsconfig: false,
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'node',
          // ... 기타 설정
        },
      },
    ],
  },
};
```

### CommonJS 패키지

`jest.config.js` 파일 생성:

```javascript
const baseConfig = require('@algocare/jest-config/base.js');

module.exports = {
  ...baseConfig,
  displayName: 'my-package',
  // 패키지별 추가 설정
};
```

## Base 설정 내용

### 기본 설정

- **Preset**: `ts-jest` (TypeScript 지원)
- **Test Environment**: `node`
- **Module File Extensions**: `['ts', 'tsx', 'js', 'jsx', 'json']`
- **Test Match**: `**/__tests__/**/*.(ts|tsx|js)`, `**/*.(test|spec).(ts|tsx|js)`

### 모듈 경로 매핑

Workspace 패키지 자동 해결:

```javascript
moduleNameMapper: {
  '^@algocare/(.*)$': '<rootDir>/../../packages/$1/src',
}
```

### 커버리지 설정

- 수집 대상: `src/**/*.{ts,tsx}`
- 제외: `*.d.ts`, `__tests__/**`, `*.test.{ts,tsx}`, `*.spec.{ts,tsx}`
- 임계값: 기본적으로 0% (필요시 패키지별로 설정)

## 패키지별 커스터마이징 예시

### ESM 패키지 예시

```javascript
// packages/services/llm/jest.config.cjs
const baseConfig = require('@algocare/jest-config/base.js');

module.exports = {
  ...baseConfig,
  displayName: 'services-llm',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: false,
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@algocare/utils/validation$': '<rootDir>/../../utils/src/validation',
    '^@algocare/(.*)$': '<rootDir>/../../$1/src',
  },
};
```

## 테스트 실행

```bash
# 테스트 실행
pnpm test

# Watch 모드
pnpm test --watch

# 커버리지 포함
pnpm test --coverage
```

## 파일 구조

```
jest-config/
├── base.js      # Base 설정
└── index.js     # (선택적) 추가 설정
```

## 참고사항

- Base 설정은 모든 패키지에서 공통으로 사용됩니다.
- 패키지별로 필요한 경우 추가 설정을 오버라이드할 수 있습니다.
- ESM 패키지는 `.cjs` 확장자를 사용하여 `require`를 사용할 수 있습니다.

## 관련 문서

- [Jest 문서](https://jestjs.io/)
- [ts-jest 문서](https://kulshekhar.github.io/ts-jest/)

