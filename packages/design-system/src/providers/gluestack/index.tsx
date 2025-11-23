import { config } from '@algocare/ui-config/tokens/color';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import React from 'react';
import { View, ViewProps } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackProvider({
  mode = 'dark',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  return (
    <View style={[config[mode], { flex: 1, height: '100%', width: '100%' }, props.style]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OverlayProvider>
          <ToastProvider>{props.children}</ToastProvider>
        </OverlayProvider>
      </GestureHandlerRootView>
    </View>
  );
}
