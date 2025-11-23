import '../global.css';

import { GluestackProvider } from '@algocare/design-system/providers/gluestack';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import 'react-native-reanimated';

import { useInitialAndroidBarSync } from '@/hooks/useColorScheme';
import { SessionProvider, useSession } from '@/providers/session';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  useInitialAndroidBarSync();

  return (
    <GluestackProvider>
      <SessionProvider>
        <StatusBar key="root-status-bar-light" style="light" />
        <RootNavigator />
      </SessionProvider>
    </GluestackProvider>
  );
};

export default RootLayout;

const RootNavigator = () => {
  const { isLoading, session } = useSession();
  const hasSession = !!session;

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  console.log('hasSession, ', session);

  return (
    <Stack
      initialRouteName="sign-in"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'black' } }}
    >
      <Stack.Protected guard={hasSession}>
        <Stack.Screen name="(authenticated)" />
      </Stack.Protected>

      <Stack.Protected guard={!hasSession}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
};
