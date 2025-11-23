import { BackgroundLayout } from '@algocare/design-system/organisms/background-layout';
import { ProgressBar } from '@algocare/design-system/organisms/progress-bar';
import { FormProvider, resolver } from '@algocare/services/form';
import { EXERCISE_LEVEL, SLEEP_QUALITY, STRESS_LEVEL } from '@algocare/utils/enums';
import { OnboardingData } from '@algocare/utils/types';
import { OnboardingDataSchema } from '@algocare/utils/validation';
import { Slot, usePathname } from 'expo-router';
import React from 'react';

type OnboardingPath =
  | '/onboarding/basic-info'
  | '/onboarding/medications'
  | '/onboarding/health-concerns'
  | '/onboarding/lifestyle'
  | '/onboarding/result';

const ONBOARDING_PROGRESS_VALUE_MAP: Record<OnboardingPath, number> = {
  '/onboarding/basic-info': 25,
  '/onboarding/medications': 50,
  '/onboarding/health-concerns': 75,
  '/onboarding/lifestyle': 100,
  '/onboarding/result': 100,
};

const OnboardingLayout = () => {
  const pathname = usePathname() as OnboardingPath;

  const progress = ONBOARDING_PROGRESS_VALUE_MAP[pathname];

  return (
    <BackgroundLayout>
      <FormProvider<OnboardingData>
        defaultValues={{
          age: 0,
          gender: undefined,
          weight: 0,
          medications: '',
          healthConcerns: [],
          exercise: undefined,
          sleepQuality: undefined,
          stressLevel: undefined,
        }}
        resolver={resolver(OnboardingDataSchema)}
      >
        {pathname !== '/onboarding/result' && <ProgressBar value={progress} />}
        <Slot />
      </FormProvider>
    </BackgroundLayout>
  );
};

export default OnboardingLayout;
