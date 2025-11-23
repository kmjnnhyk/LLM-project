# Design System

AlgoCare 프로젝트의 디자인 시스템입니다. Gluestack UI를 기반으로 한 React Native 컴포넌트 라이브러리입니다.

## 패키지 구조

```
src/
├── components/        # 기본 컴포넌트 (직접 사용 불가)
├── organisms/         # 복합 컴포넌트 (앱에서 사용 가능)
├── hooks/            # 커스텀 훅
└── providers/        # Provider 컴포넌트
```

## 설치

이 패키지는 workspace 내부 패키지이므로 별도 설치가 필요 없습니다.

## 사용 규칙

### ⚠️ 중요: Organism만 사용 가능

**클라이언트 앱(`apps/client`)에서는 `organisms`만 직접 사용할 수 있습니다.**

```tsx
// ✅ 올바른 사용
import { BackgroundLayout } from '@algocare/design-system/organisms/background-layout';
import { Buttons } from '@algocare/design-system/organisms/buttons';
import { FormFieldOrganism } from '@algocare/design-system/organisms/form-field';
import { VStack } from '@algocare/design-system/components/v-stack';
import { HStack } from '@algocare/design-system/components/h-stack';

// ❌ 잘못된 사용 (직접 컴포넌트 import 불가)
import { Button } from '@algocare/design-system/components/button';
import { Text } from '@algocare/design-system/components/text';
```

**예외**: 레이아웃을 위한 `VStack`, `HStack`은 직접 사용 가능합니다.

## 사용 가능한 Organisms

### BackgroundLayout

화면 배경 레이아웃

```tsx
import { BackgroundLayout } from '@algocare/design-system/organisms/background-layout';

<BackgroundLayout>
  {/* 내용 */}
</BackgroundLayout>
```

### Buttons

버튼 그룹

```tsx
import { Buttons } from '@algocare/design-system/organisms/buttons';

<Buttons
  primary={{ label: '확인', onPress: handleConfirm }}
  secondary={{ label: '취소', onPress: handleCancel }}
/>
```

### Cards

카드 컴포넌트

```tsx
import { Cards } from '@algocare/design-system/organisms/cards';

<Cards
  title="카드 제목"
  content="카드 내용"
/>
```

### FormField

폼 필드

```tsx
import { FormFieldOrganism } from '@algocare/design-system/organisms/form-field';

<FormFieldOrganism
  label="이름"
  placeholder="이름을 입력하세요"
  value={name}
  onChangeText={setName}
/>
```

### FormFields

여러 폼 필드 그룹

```tsx
import { FormFields } from '@algocare/design-system/organisms/form-fields';

<FormFields
  fields={[
    { label: '이름', value: name, onChangeText: setName },
    { label: '이메일', value: email, onChangeText: setEmail },
  ]}
/>
```

### ImageContainer

이미지 컨테이너

```tsx
import { ImageContainer } from '@algocare/design-system/organisms/image-container';

<ImageContainer
  source={{ uri: 'https://example.com/image.jpg' }}
  alt="이미지 설명"
/>
```

### ProgressBar

진행률 표시 바

```tsx
import { ProgressBar } from '@algocare/design-system/organisms/progress-bar';

<ProgressBar value={75} />
```

### TextContainer

텍스트 컨테이너

```tsx
import { TextContainer } from '@algocare/design-system/organisms/text-container';

<TextContainer
  title="제목"
  content="내용"
/>
```

### Fabs

Floating Action Buttons

```tsx
import { Fabs } from '@algocare/design-system/organisms/fabs';

<Fabs
  icon="plus"
  onPress={handlePress}
/>
```

## Provider 사용

### GluestackProvider

앱 루트에 GluestackProvider를 추가해야 합니다.

```tsx
import { GluestackProvider } from '@algocare/design-system/providers/gluestack';

export default function App() {
  return (
    <GluestackProvider>
      {/* 앱 내용 */}
    </GluestackProvider>
  );
}
```

## Hooks

### Modal Hook

```tsx
import { useModal } from '@algocare/design-system/hooks/modal';

const { isOpen, openModal, closeModal } = useModal();
```

### Toast Hook

```tsx
import { useToast } from '@algocare/design-system/hooks/toast';

const toast = useToast();

toast.show({
  title: '알림',
  description: '메시지',
});
```

## 새로운 Organism 추가

필요한 organism이 없는 경우:

1. `src/organisms/` 디렉토리에 새 organism 추가
2. organism은 `components/`의 컴포넌트들을 조합하여 구성
3. `package.json`의 exports에 추가 (필요한 경우)
4. 앱에서 import하여 사용

**예시:**

```tsx
// src/organisms/my-organism/index.tsx
import { VStack } from '../../components/v-stack';
import { Text } from '../../components/text';
import { Button } from '../../components/button';

export function MyOrganism({ title, onPress }) {
  return (
    <VStack space="md">
      <Text>{title}</Text>
      <Button onPress={onPress}>클릭</Button>
    </VStack>
  );
}
```

## 레이아웃 컴포넌트

### VStack

세로 방향 스택

```tsx
import { VStack } from '@algocare/design-system/components/v-stack';

<VStack space="md">
  <Text>항목 1</Text>
  <Text>항목 2</Text>
</VStack>
```

### HStack

가로 방향 스택

```tsx
import { HStack } from '@algocare/design-system/components/h-stack';

<HStack space="md">
  <Text>항목 1</Text>
  <Text>항목 2</Text>
</HStack>
```

## 스타일링

Design System은 NativeWind (TailwindCSS)를 사용합니다. Organism 내부에서 스타일이 적용되어 있으므로, 대부분의 경우 추가 스타일링이 필요 없습니다.

## 참고사항

- 모든 컴포넌트는 TypeScript로 작성되어 타입 안정성을 보장합니다.
- 웹과 네이티브 모두 지원합니다 (`.web.tsx` 파일로 웹 전용 구현 가능).
- Gluestack UI를 기반으로 하며, 커스터마이징이 가능합니다.

## 관련 문서

- [Gluestack UI 문서](https://ui.gluestack.io/)
- [NativeWind 문서](https://www.nativewind.dev/)

