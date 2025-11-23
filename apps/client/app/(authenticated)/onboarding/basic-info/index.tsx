import { Box } from '@algocare/design-system/components/box';
import { IButtonProps, Buttons } from '@algocare/design-system/organisms/buttons';
import { FormFieldOrganism } from '@algocare/design-system/organisms/form-field';
import { TextContainer } from '@algocare/design-system/organisms/text-container';
import { Field, useForm } from '@algocare/services/form';
import { OnboardingData } from '@algocare/utils/types';
import { router } from 'expo-router';

export default function OnboardingBasicInfoScreen() {
  const { trigger, getFieldState } = useForm<OnboardingData>();

  const handlePressNextButton = () => {
    trigger();

    const ageFieldState = getFieldState('age');
    const genderFieldState = getFieldState('gender');
    const weightFieldState = getFieldState('weight');

    const isAgeValid = ageFieldState.isDirty && !ageFieldState.error;
    const isGenderValid = genderFieldState.isDirty && !genderFieldState.error;
    const isWeightValid = weightFieldState.isDirty && !weightFieldState.error;

    if (!isAgeValid || !isGenderValid || !isWeightValid) {
      return;
    }

    router.push('/onboarding/medications');
  };

  const buttons: IButtonProps[] = [
    {
      text: '다음 단계',
      variant: 'solid',
      action: 'primary',
      onPress: handlePressNextButton,
    },
  ];

  return (
    <Box className="flex-1">
      <TextContainer
        title={`기본 정보를\n입력해 주세요`}
        description="맞춤형 영양제 추천을 위한 기본 정보를 알려주세요"
      />

      <Field<OnboardingData, 'age'>
        name="age"
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
          <FormFieldOrganism
            type="input"
            title="나이"
            placeholder="예: 30"
            value={value ? String(value) : ''}
            onChange={(text) => {
              const numValue = Number(text);
              onChange(numValue);
            }}
            error={error && { message: error.message || '' }}
            isRequired={isRequired}
          />
        )}
      />

      <Field<OnboardingData, 'gender'>
        name="gender"
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
          <FormFieldOrganism
            type="radio"
            title="성별"
            value={value || ''}
            onChange={onChange}
            error={error && { message: error.message || '' }}
            isRequired={isRequired}
            direction="horizontal"
            options={[
              { value: 'male', label: '남성' },
              { value: 'female', label: '여성' },
            ]}
          />
        )}
      />

      <Field<OnboardingData, 'weight'>
        name="weight"
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
          <FormFieldOrganism
            type="input"
            title="체중 (kg)"
            placeholder="예: 65"
            value={value ? String(value) : ''}
            onChange={(text) => {
              const numValue = Number(text);
              onChange(numValue);
            }}
            error={error && { message: error.message || '' }}
            isRequired={isRequired}
          />
        )}
      />

      <Buttons placement="bottom" direction="vertical" buttons={buttons} />
    </Box>
  );
}
