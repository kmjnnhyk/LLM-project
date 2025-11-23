import { VStack } from '@algocare/design-system/components/v-stack';
import { BackgroundLayout } from '@algocare/design-system/organisms/background-layout';
import { IButtonProps, Buttons } from '@algocare/design-system/organisms/buttons';
import { ImageContainer } from '@algocare/design-system/organisms/image-container';
import Logo from '@assets/images/logo.svg';
import { router } from 'expo-router';
import { useState } from 'react';

import { useSession } from '@/providers/session';

export default function SigninScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSession();

  const handlePressLoginButton = async () => {
    setIsLoading(true);
    await signIn();
    router.replace('/(authenticated)');
    setIsLoading(false);
  };

  const buttons: IButtonProps[] = [
    {
      isLoading,
      text: '로그인',
      action: 'primary',
      onPress: handlePressLoginButton,
    },
  ];

  return (
    <BackgroundLayout>
      <VStack className="flex-1 justify-center">
        <ImageContainer size="2xl" src={Logo} alt="image" />
        <Buttons direction="vertical" buttons={buttons} />
      </VStack>
    </BackgroundLayout>
  );
}
