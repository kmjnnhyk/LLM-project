# UI Config

AlgoCare 프로젝트의 UI 설정입니다. TailwindCSS 설정과 디자인 토큰을 제공합니다.

## 패키지 구조

```
ui/
├── tailwind/
│   ├── index.js              # TailwindCSS 기본 설정
│   ├── index.d.ts            # TypeScript 타입 정의
│   ├── tailwind.config.base.js
│   └── tailwind.config.base.d.ts
└── token/
    ├── color.ts              # 색상 토큰
    └── index.ts
```

## 설치

이 패키지는 workspace 내부 패키지이므로 별도 설치가 필요 없습니다.

## 사용 방법

### TailwindCSS 설정 사용

`tailwind.config.js`:

```javascript
const baseConfig = require('@algocare/ui-config/tailwind');

module.exports = {
  ...baseConfig,
  // 추가 설정
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
};
```

### 색상 토큰 사용

```typescript
import { colors } from '@algocare/ui-config/tokens/color';

// 색상 토큰 사용
const primaryColor = colors.primary;
```

## 포함된 설정

### TailwindCSS Base Config

- Gluestack UI NativeWind 유틸리티 통합
- 기본 플러그인 설정
- 커스텀 유틸리티 함수

### Color Tokens

디자인 시스템의 색상 토큰:

```typescript
export const colors = {
  primary: '#...',
  secondary: '#...',
  // ... 기타 색상
};
```

## 커스터마이징

### TailwindCSS 설정 확장

```javascript
const baseConfig = require('@algocare/ui-config/tailwind');

module.exports = {
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    extend: {
      colors: {
        // 커스텀 색상 추가
        custom: '#...',
      },
    },
  },
};
```

## 참고사항

- 이 설정은 Gluestack UI의 NativeWind 유틸리티를 사용합니다.
- 모든 패키지에서 동일한 UI 설정을 사용합니다.
- 색상 토큰은 디자인 시스템의 일관성을 보장합니다.

## 관련 문서

- [TailwindCSS 문서](https://tailwindcss.com/)
- [NativeWind 문서](https://www.nativewind.dev/)
- [Gluestack UI 문서](https://ui.gluestack.io/)

