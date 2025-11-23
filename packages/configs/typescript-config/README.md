# TypeScript Config

AlgoCare 프로젝트의 공통 TypeScript 설정입니다.

## 설치

이 패키지는 workspace 내부 패키지이므로 별도 설치가 필요 없습니다.

## 사용 방법

### tsconfig.json에서 사용

```json
{
  "extends": "@algocare/typescript-config/tsconfig.app.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 포함된 설정

### tsconfig.app.json

앱/패키지용 TypeScript 설정:

- **Target**: ES2022
- **Module**: ESNext
- **Module Resolution**: node
- **Strict Mode**: 활성화
- **ES Module Interop**: 활성화
- **Skip Lib Check**: 활성화 (빌드 속도 향상)

## 패키지별 커스터마이징

패키지별로 필요한 경우 추가 설정을 오버라이드할 수 있습니다:

```json
{
  "extends": "@algocare/typescript-config/tsconfig.app.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@algocare/utils/*": ["../../utils/src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 타입 체크

```bash
# 타입 체크만 실행 (빌드 없이)
pnpm type-check
```

## 참고사항

- 모든 패키지에서 동일한 TypeScript 설정을 사용합니다.
- 필요시 패키지별로 추가 설정을 오버라이드할 수 있습니다.
- Strict mode가 활성화되어 있어 타입 안정성을 보장합니다.

## 관련 문서

- [TypeScript 문서](https://www.typescriptlang.org/)
- [TypeScript 컴파일러 옵션](https://www.typescriptlang.org/tsconfig)

