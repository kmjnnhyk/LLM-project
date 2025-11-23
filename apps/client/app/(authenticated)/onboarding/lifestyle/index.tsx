import { Box } from '@algocare/design-system/components/box';
import { useToast } from '@algocare/design-system/hooks/toast';
import { type IButtonProps, Buttons } from '@algocare/design-system/organisms/buttons';
import { FormFieldOrganism } from '@algocare/design-system/organisms/form-field';
import { TextContainer } from '@algocare/design-system/organisms/text-container';
import { Field, useForm } from '@algocare/services/form';
import { getNutritionRecommendations, ApiClientError } from '@algocare/services/nutrition';
import { EXERCISE_LEVEL, SLEEP_QUALITY, STRESS_LEVEL } from '@algocare/utils/enums';
import { OnboardingData } from '@algocare/utils/types';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

export default function OnboardingLifestyleScreen() {
  const { handleSubmit, getFieldState } = useForm<OnboardingData>();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handlePressCompleteButton = handleSubmit(async (data) => {
    const exerciseFieldState = getFieldState('exercise');
    const sleepQualityFieldState = getFieldState('sleepQuality');
    const stressLevelFieldState = getFieldState('stressLevel');

    const isExerciseValid = exerciseFieldState.isDirty && !exerciseFieldState.error;
    const isSleepQualityValid = sleepQualityFieldState.isDirty && !sleepQualityFieldState.error;
    const isStressLevelValid = stressLevelFieldState.isDirty && !stressLevelFieldState.error;

    if (!isExerciseValid || !isSleepQualityValid || !isStressLevelValid) {
      console.log('운동 여부, 수면의 질, 스트레스 수준을 선택해주세요');
      return;
    }

    setIsLoading(true);

    try {
      const recommendations = await getNutritionRecommendations(data);

      router.push({
        pathname: '/onboarding/result',
        params: { recommendations: JSON.stringify(recommendations) },
      });
    } catch (error: unknown) {
      let errorMessage = '영양제 추천을 받는 중 오류가 발생했습니다.';

      if (error instanceof ApiClientError || error instanceof Error) {
        errorMessage = (error as Error).message;
      }

      showToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  });

  const handlePressBack = () => {
    router.back();
  };

  const buttons: IButtonProps[] = [
    {
      text: '이전',
      onPress: handlePressBack,
      variant: 'outline',
      action: 'secondary',
    },
    {
      text: '온보딩 완료',
      onPress: handlePressCompleteButton,
      variant: 'solid',
      action: 'primary',
      isLoading,
    },
  ];

  return (
    <Box className="flex-1">
      <TextContainer
        title={`생활 패턴을\n알려주세요`}
        description="일상적인 생활 패턴을 알려주시면 더 정확한 영양제를 추천해드립니다"
      />
      <ScrollView className="flex-1">
        <Field<OnboardingData, 'exercise'>
          name="exercise"
          render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => {
            return (
              <FormFieldOrganism
                type="radio"
                title="운동 여부"
                value={value || ''}
                onChange={onChange}
                error={error && { message: error.message || '' }}
                isRequired={isRequired}
                direction="vertical"
                options={[
                  { value: EXERCISE_LEVEL.none, label: '운동하지 않음' },
                  {
                    value: EXERCISE_LEVEL.light,
                    label: '가벼운 운동 (주 1-2회, 걷기, 스트레칭 등)',
                  },
                  {
                    value: EXERCISE_LEVEL.moderate,
                    label: '보통 운동 (주 3-4회, 조깅, 자전거 등)',
                  },
                  {
                    value: EXERCISE_LEVEL.intensive,
                    label: '격렬한 운동 (주 5회 이상, 헬스, 달리기 등)',
                  },
                ]}
              />
            );
          }}
        />

        <Field<OnboardingData, 'sleepQuality'>
          name="sleepQuality"
          render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
            <FormFieldOrganism
              type="radio"
              title="수면의 질"
              value={value || ''}
              onChange={onChange}
              error={error && { message: error.message || '' }}
              isRequired={isRequired}
              direction="vertical"
              options={[
                {
                  value: SLEEP_QUALITY.poor,
                  label: '나쁨 - 충분히 잠들지 못하고 자주 깸',
                },
                {
                  value: SLEEP_QUALITY.fair,
                  label: '보통 - 때때로 잠들기 어려울 때가 있음',
                },
                {
                  value: SLEEP_QUALITY.good,
                  label: '좋음 - 대체로 잘 잠들고 수면 시간이 충분함',
                },
                {
                  value: SLEEP_QUALITY.excellent,
                  label: '매우 좋음 - 항상 편안하게 잠들고 깊게 잠',
                },
              ]}
            />
          )}
        />

        <Field<OnboardingData, 'stressLevel'>
          name="stressLevel"
          render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
            <FormFieldOrganism
              type="radio"
              title="스트레스 수준"
              value={value || ''}
              onChange={onChange}
              error={error && { message: error.message || '' }}
              isRequired={isRequired}
              direction="vertical"
              options={[
                {
                  value: STRESS_LEVEL.low,
                  label: '낮음 - 스트레스를 거의 느끼지 않음',
                },
                {
                  value: STRESS_LEVEL.moderate,
                  label: '보통 - 때때로 스트레스를 느낌',
                },
                {
                  value: STRESS_LEVEL.high,
                  label: '높음 - 자주 스트레스를 느끼고 불안함',
                },
                {
                  value: STRESS_LEVEL.veryHigh,
                  label: '매우 높음 - 거의 항상 스트레스로 인해 힘듦',
                },
              ]}
            />
          )}
        />
      </ScrollView>

      <Buttons placement="bottom" direction="vertical" buttons={buttons} />
    </Box>
  );
}
