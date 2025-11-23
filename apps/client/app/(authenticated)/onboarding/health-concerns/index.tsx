import { Box } from '@algocare/design-system/components/box';
import { type IButtonProps, Buttons } from '@algocare/design-system/organisms/buttons';
import { FormFieldOrganism } from '@algocare/design-system/organisms/form-field';
import { TextContainer } from '@algocare/design-system/organisms/text-container';
import { Field, useForm } from '@algocare/services/form';
import { HEALTH_CONCERN } from '@algocare/utils/enums';
import { OnboardingData } from '@algocare/utils/types';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

export default function OnboardingHealthConcernsScreen() {
  const { getFieldState, trigger } = useForm<OnboardingData>();
  const [otherCustomText, setOtherCustomText] = useState('');

  const handlePressBackButton = () => {
    router.back();
  };

  const handlePressNextButton = () => {
    trigger();

    const healthConcernsFieldState = getFieldState('healthConcerns');
    const isHealthConcernsValid =
      healthConcernsFieldState.isDirty && !healthConcernsFieldState.error;
    if (!isHealthConcernsValid) {
      return;
    }

    router.push('/onboarding/lifestyle');
  };

  const buttons: IButtonProps[] = [
    {
      text: '이전',
      onPress: handlePressBackButton,
      variant: 'outline',
      action: 'secondary',
    },
    {
      text: '다음 단계',
      onPress: handlePressNextButton,
      variant: 'solid',
      action: 'primary',
    },
  ];

  const healthConcernOptions = [
    {
      value: HEALTH_CONCERN.fatigue,
      label: '피로',
      description: '만성적인 피로감이나 에너지 부족',
    },
    {
      value: HEALTH_CONCERN.digestion,
      label: '소화불량',
      description: '소화 기능 저하나 소화불량',
    },
    {
      value: HEALTH_CONCERN.immunity,
      label: '면역력 저하',
      description: '감기에 자주 걸리거나 면역력이 약함',
    },
    {
      value: HEALTH_CONCERN.sleep,
      label: '수면 문제',
      description: '불면증이나 수면의 질 저하',
    },
    {
      value: HEALTH_CONCERN.stress,
      label: '스트레스',
      description: '일상적인 스트레스나 불안감',
    },
    {
      value: HEALTH_CONCERN.joint,
      label: '관절 건강',
      description: '관절 통증이나 뻣뻣함',
    },
    {
      value: HEALTH_CONCERN.skin,
      label: '피부 건강',
      description: '피부 트러블이나 노화 관리',
    },
    {
      value: HEALTH_CONCERN.memory,
      label: '기억력',
      description: '기억력 감퇴나 집중력 저하',
    },
    {
      value: HEALTH_CONCERN.other,
      label: '기타',
      description: '직접 입력하여 건강 고민을 알려주세요',
    },
  ];

  return (
    <Box className="flex-1">
      <TextContainer
        title={`건강 고민을\n선택해 주세요`}
        description="현재 가장 큰 건강 고민이 무엇인지 알려주세요. 맞춤형 영양제를 추천해드립니다"
      />
      <ScrollView className="flex-1">
        <Field<OnboardingData, 'healthConcerns'>
          name="healthConcerns"
          render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => {
            const currentValue = Array.isArray(value) ? value : [];
            const validOptions = currentValue.filter((v) =>
              healthConcernOptions.some((opt) => opt.value === v)
            ) as HEALTH_CONCERN[];

            const checkboxValue =
              otherCustomText.trim() && validOptions.includes(HEALTH_CONCERN.other)
                ? [...validOptions]
                : validOptions;

            return (
              <FormFieldOrganism
                type="card"
                title="건강 고민"
                multiselect
                value={checkboxValue}
                onChange={(selectedValues) => {
                  const newValues = selectedValues as string[];
                  const validHealthConcerns = newValues.filter((v) =>
                    Object.values(HEALTH_CONCERN).includes(v as HEALTH_CONCERN)
                  ) as HEALTH_CONCERN[];

                  if (!newValues.includes(HEALTH_CONCERN.other)) {
                    // 기타가 선택 해제되면 텍스트도 초기화
                    setOtherCustomText('');
                    onChange(validHealthConcerns);
                  } else {
                    // 기타가 선택되면 HEALTH_CONCERN.other 추가
                    onChange([
                      ...validHealthConcerns.filter((v) => v !== HEALTH_CONCERN.other),
                      HEALTH_CONCERN.other,
                    ]);
                  }
                }}
                error={error && { message: error.message || '' }}
                isRequired={isRequired}
                options={healthConcernOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                  description: option.description,
                  expandable:
                    option.value === HEALTH_CONCERN.other
                      ? {
                          type: 'input',
                          label: '직접 입력',
                          placeholder: '예: 두통, 어지러움, 집중력 저하 등',
                          value: otherCustomText,
                          onChange: (text) => {
                            setOtherCustomText(text);
                            const currentValidOptions = currentValue.filter((v) =>
                              healthConcernOptions.some((opt) => opt.value === v)
                            ) as HEALTH_CONCERN[];

                            if (text.trim()) {
                              // 텍스트가 있으면 HEALTH_CONCERN.other 유지
                              if (!currentValidOptions.includes(HEALTH_CONCERN.other)) {
                                onChange([...currentValidOptions, HEALTH_CONCERN.other]);
                              }
                            } else {
                              // 텍스트가 없으면 HEALTH_CONCERN.other 제거
                              onChange(
                                currentValidOptions.filter((v) => v !== HEALTH_CONCERN.other)
                              );
                            }
                          },
                        }
                      : undefined,
                }))}
              />
            );
          }}
        />
      </ScrollView>

      <Buttons placement="bottom" direction="vertical" buttons={buttons} />
    </Box>
  );
}
