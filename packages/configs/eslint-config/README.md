# ESLint Config

AlgoCare 프로젝트의 공통 ESLint 설정입니다.

## 설치

이 패키지는 workspace 내부 패키지이므로 별도 설치가 필요 없습니다.

## 사용 방법

### package.json에서 사용

```json
{
  "eslintConfig": {
    "extends": "@algocare/eslint-config"
  }
}
```

### 설정 파일에서 사용

`.eslintrc.js`:

```javascript
module.exports = {
  extends: '@algocare/eslint-config',
  // 추가 규칙 설정
  rules: {
    // 커스텀 규칙
  },
};
```

## 포함된 설정

- `eslint-config-universe`: React Native 및 Expo를 위한 ESLint 설정
- Prettier 통합: 코드 포맷팅 자동화
- TypeScript 지원: TypeScript 파일 린팅

## 주요 규칙

- Prettier 통합: 코드 포맷팅 자동 적용
- React Native 최적화: React Native 관련 규칙 포함
- TypeScript 지원: TypeScript 파일 자동 린팅

## 커스터마이징

패키지별로 추가 규칙을 설정할 수 있습니다:

```json
{
  "eslintConfig": {
    "extends": "@algocare/eslint-config",
    "rules": {
      "no-console": "warn"
    }
  }
}
```

## 실행

```bash
# 린트 검사
pnpm lint

# 자동 수정
pnpm lint --fix
```

## 참고사항

- 이 설정은 `eslint-config-universe`를 기반으로 합니다.
- Prettier와 통합되어 있어 코드 포맷팅이 자동으로 적용됩니다.
- 모든 패키지에서 동일한 린팅 규칙을 사용합니다.

## 관련 문서

- [ESLint 문서](https://eslint.org/)
- [eslint-config-universe 문서](https://github.com/expo/expo/tree/main/packages/eslint-config-universe)

