import { Box } from '@algocare/design-system/components/box';
import { type IButtonProps, Buttons } from '@algocare/design-system/organisms/buttons';
import { FormFieldOrganism } from '@algocare/design-system/organisms/form-field';
import { TextContainer } from '@algocare/design-system/organisms/text-container';
import { Field, useForm } from '@algocare/services/form';
import { OnboardingData } from '@algocare/utils/types';
import { router } from 'expo-router';

export default function OnboardingMedicationsScreen() {
  const { getFieldState, trigger } = useForm<OnboardingData>();

  const handlePressNextButon = () => {
    trigger();

    const medicationsFieldState = getFieldState('medications');
    const isMedicationsValid = !medicationsFieldState.error;
    if (!isMedicationsValid) {
      return;
    }

    router.push('/onboarding/health-concerns');
  };

  const handlePressBackButton = () => {
    router.back();
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
      onPress: handlePressNextButon,
      variant: 'solid',
      action: 'primary',
    },
  ];

  return (
    <Box className="flex-1">
      <TextContainer
        title={`복용 중인 약물을\n알려주세요`}
        description="현재 복용 중인 약물이 있다면 입력해주세요. 영양제와의 상호작용을 확인하기 위해 필요합니다"
      />

      <Field<OnboardingData, 'medications'>
        name="medications"
        rules={{
          maxLength: {
            value: 500,
            message: '500자 이내로 입력해주세요',
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
          <FormFieldOrganism
            type="textarea"
            title="복용 중인 약물 (선택사항)"
            placeholder="예: 혈압약, 당뇨약, 항우울제 등&#10;약물 이름과 복용 빈도를 자유롭게 입력해주세요"
            value={value || ''}
            onChange={onChange}
            error={error && { message: error.message || '' }}
            isRequired={isRequired}
          />
        )}
      />

      <Buttons placement="bottom" direction="vertical" buttons={buttons} />
    </Box>
  );
}
