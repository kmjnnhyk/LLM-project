# AlgoCare Client App

영양제 추천을 위한 React Native 클라이언트 앱입니다.

## 기술 스택

- **Framework**: Expo (v53)
- **Routing**: Expo Router (파일 기반 라우팅)
- **UI Library**: Gluestack UI + NativeWind (TailwindCSS)
- **Design System**: `@algocare/design-system`
- **State Management**: React Hooks + Context API
- **Form Handling**: React Hook Form
- **TypeScript**: Full TypeScript support

## 프로젝트 구조

```
app/
├── _layout.tsx                    # 루트 레이아웃
├── sign-in.tsx                   # 로그인 화면
├── (authenticated)/              # 인증된 사용자 전용
│   ├── _layout.tsx              # 인증된 사용자 레이아웃
│   ├── index.tsx                # 홈 화면
│   └── onboarding/              # 온보딩 플로우
│       ├── _layout.tsx          # 온보딩 레이아웃
│       ├── basic-info/          # 기본 정보 입력
│       ├── health-concerns/    # 건강 고민 선택
│       ├── lifestyle/           # 생활 패턴 입력
│       ├── medications/         # 복용 중인 약물 입력
│       └── result/              # 추천 결과 화면
├── home/                         # 홈 화면
└── +not-found.tsx               # 404 화면

providers/
└── session.tsx                   # 세션 관리 Provider

hooks/
├── useColorScheme.ts            # 다크모드 훅
└── useStorageState.ts           # 로컬 스토리지 훅

assets/
├── fonts/                       # NotoSansKR 폰트
└── images/                      # 앱 이미지 리소스
```

## 설치

```bash
pnpm install
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**기본값:**
- 개발 환경: `http://localhost:3000`
- 프로덕션 환경: `https://api.algocare.com/api`

## 실행

### 개발 모드

```bash
# 개발 서버 시작 (캐시 클리어)
pnpm dev

# 또는
pnpm start
```

### 플랫폼별 실행

```bash
# iOS 시뮬레이터
pnpm ios

# Android 에뮬레이터
pnpm android

# 웹 브라우저
pnpm web
```

## 빌드

### 프로덕션 빌드

```bash
pnpm build
```

빌드 결과물은 `build/` 디렉토리에 생성됩니다.

## 주요 기능

### 1. 인증 플로우

- 로그인 화면 (`sign-in.tsx`)
- 세션 관리 (`providers/session.tsx`)
- 인증된 사용자 전용 라우트 보호

### 2. 온보딩 플로우

사용자가 처음 앱을 사용할 때 진행하는 단계별 입력:

1. **기본 정보** (`basic-info/`)
   - 나이, 성별, 체중 입력

2. **건강 고민** (`health-concerns/`)
   - 건강 고민 다중 선택

3. **생활 패턴** (`lifestyle/`)
   - 운동 수준, 수면의 질, 스트레스 수준 선택

4. **복용 중인 약물** (`medications/`)
   - 복용 중인 약물 정보 입력

5. **추천 결과** (`result/`)
   - 맞춤형 영양제 추천 결과 표시

### 3. Design System 사용

앱에서는 `@algocare/design-system`의 **organism**만 사용할 수 있습니다:

```tsx
import { BackgroundLayout } from '@algocare/design-system/organisms/background-layout';
import { Buttons } from '@algocare/design-system/organisms/buttons';
import { FormFieldOrganism } from '@algocare/design-system/organisms/form-field';
import { VStack } from '@algocare/design-system/components/v-stack';
import { HStack } from '@algocare/design-system/components/h-stack';
```

**주의**: 컴포넌트를 직접 import하여 사용할 수 없습니다. organism만 사용 가능합니다.

## 라우팅

Expo Router의 파일 기반 라우팅을 사용합니다.

### 라우트 보호

```tsx
// 인증된 사용자만 접근 가능
<Stack.Protected guard={hasSession}>
  <Stack.Screen name="(authenticated)" />
</Stack.Protected>

// 비인증 사용자만 접근 가능
<Stack.Protected guard={!hasSession}>
  <Stack.Screen name="sign-in" />
</Stack.Protected>
```

### 네비게이션

```tsx
import { router } from 'expo-router';

// 화면 이동
router.push('/onboarding/basic-info');

// 뒤로 가기
router.back();

// 특정 화면으로 이동 (히스토리 초기화)
router.replace('/home');
```

## 스타일링

### NativeWind (TailwindCSS)

```tsx
import { View, Text } from 'react-native';

<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-2xl font-bold text-gray-900">
    Hello World
  </Text>
</View>
```

### Design System Organisms

```tsx
import { BackgroundLayout } from '@algocare/design-system/organisms/background-layout';
import { VStack } from '@algocare/design-system/components/v-stack';

<BackgroundLayout>
  <VStack space="md">
    {/* 내용 */}
  </VStack>
</BackgroundLayout>
```

## API 통신

`@algocare/services` 패키지를 사용하여 백엔드 API와 통신합니다:

```tsx
import { getNutritionRecommendations, ApiClientError } from '@algocare/services/nutrition';
import type { OnboardingData } from '@algocare/utils/types';

try {
  const data: OnboardingData = {
    age: 30,
    gender: 'male',
    weight: 80,
    healthConcerns: [HEALTH_CONCERN.digestion],
    exercise: EXERCISE_LEVEL.moderate,
    sleepQuality: SLEEP_QUALITY.good,
    stressLevel: STRESS_LEVEL.moderate,
    medications: '비피더스 유산균',
  };

  const result = await getNutritionRecommendations(data);
  console.log('추천 결과:', result.recommendations);
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.message);
  }
}
```

자세한 내용은 `packages/services/frontend/README.md`를 참고하세요.

## 테스트

```bash
pnpm test
```

Jest와 `jest-expo`를 사용하여 테스트를 실행합니다.

## 개발 가이드

### 새로운 화면 추가

1. `app/` 디렉토리에 새 파일 생성
2. 파일 경로가 자동으로 라우트가 됩니다
   - `app/about.tsx` → `/about`
   - `app/settings/index.tsx` → `/settings`

### Design System Organism 추가

필요한 organism이 없는 경우:

1. `packages/design-system/src/organisms/`에 새 organism 추가
2. organism은 design-system의 컴포넌트들을 조합하여 구성
3. 앱에서 import하여 사용

### 환경 변수 사용

```tsx
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

**주의**: Expo에서는 `EXPO_PUBLIC_` 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능합니다.

## iOS 빌드

```bash
# iOS 시뮬레이터에서 실행
pnpm ios

# 실제 디바이스에서 실행 (개발 빌드)
eas build --profile development --platform ios
```

## Android 빌드

```bash
# Android 에뮬레이터에서 실행
pnpm android

# 실제 디바이스에서 실행 (개발 빌드)
eas build --profile development --platform android
```

## 프로덕션 배포

EAS Build를 사용하여 프로덕션 빌드를 생성합니다:

```bash
# iOS 프로덕션 빌드
eas build --profile production --platform ios

# Android 프로덕션 빌드
eas build --profile production --platform android
```

## 문제 해결

### Metro 번들러 캐시 문제

```bash
pnpm dev  # -c 플래그로 캐시 클리어
```

### iOS 빌드 문제

```bash
cd ios
pod install
cd ..
```

### Android 빌드 문제

```bash
# Gradle 캐시 클리어
cd android
./gradlew clean
cd ..
```

## 참고사항

- **New Architecture**: React Native의 New Architecture가 활성화되어 있습니다 (`newArchEnabled: true`)
- **다크모드**: 시스템 설정에 따라 자동으로 다크모드가 적용됩니다
- **타입 안정성**: 모든 코드는 TypeScript로 작성되어 타입 안정성을 보장합니다
- **폰트**: NotoSansKR 폰트가 포함되어 있습니다
- **아이콘**: Lucide React Native를 사용합니다

## 관련 문서

- [Expo Router 문서](https://docs.expo.dev/router/introduction/)
- [NativeWind 문서](https://www.nativewind.dev/)
- [Gluestack UI 문서](https://ui.gluestack.io/)
- [Design System README](../../packages/design-system/README.md)
- [Frontend Services README](../../packages/services/frontend/README.md)

