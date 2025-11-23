import { Badge, BadgeText } from '@algocare/design-system/components/badge';
import { Box } from '@algocare/design-system/components/box';
import { Text } from '@algocare/design-system/components/text';
import { VStack } from '@algocare/design-system/components/v-stack';
import { BackgroundLayout } from '@algocare/design-system/organisms/background-layout';
import { type IButtonProps, Buttons } from '@algocare/design-system/organisms/buttons';
import { CardsOrganism } from '@algocare/design-system/organisms/cards';
import { TextContainer } from '@algocare/design-system/organisms/text-container';
import { NutritionResponse } from '@algocare/utils/types';
import { useLocalSearchParams, router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';

const OnboardingResultScreen = () => {
  const { recommendations } = useLocalSearchParams();
  const parsedRecommendations = JSON.parse(
    (recommendations as string) || '{}'
  ) as NutritionResponse;

  const handlePressComplete = () => {
    router.push('/home');
  };

  const cardOptions = useMemo(() => {
    if (!parsedRecommendations.recommendations) {
      return [];
    }

    return parsedRecommendations.recommendations
      .sort((a, b) => a.priority - b.priority)
      .map((rec) => {
        const priorityLabels: Record<number, string> = {
          1: '우선순위 높음',
          2: '우선순위 보통',
          3: '우선순위 낮음',
        };

        const priorityColors: Record<number, 'error' | 'warning' | 'success'> = {
          1: 'error',
          2: 'warning',
          3: 'success',
        };

        const expandableContent = [
          rec.dosage && `복용량: ${rec.dosage}`,
          rec.timing && `복용 시기: ${rec.timing}`,
        ]
          .filter(Boolean)
          .join('\n');

        return {
          title: rec.name,
          description: rec.reason,
          badges: [
            {
              label: priorityLabels[rec.priority] || `우선순위 ${rec.priority}`,
              action: priorityColors[rec.priority] || 'success',
            },
          ],
          expandable: expandableContent
            ? {
                type: 'text' as const,
                label: '복용 방법',
                content: expandableContent,
              }
            : undefined,
        };
      });
  }, [parsedRecommendations.recommendations]);

  const buttons: IButtonProps[] = [
    {
      text: '완료',
      onPress: handlePressComplete,
      variant: 'solid',
      action: 'primary',
    },
  ];

  return (
    <Box className="flex-1">
      <TextContainer
        title="맞춤 영양제 추천"
        description={parsedRecommendations.summary || '당신에게 맞는 영양제를 추천해드립니다.'}
      />
      <ScrollView className="flex-1">
        {parsedRecommendations.warnings && parsedRecommendations.warnings.length > 0 && (
          <VStack space="sm" className="p-3">
            {parsedRecommendations.warnings.map((warning, index) => (
              <Box key={index} className="bg-warning-50 rounded-lg p-3">
                <VStack space="xs">
                  <Badge action="warning" variant="solid" size="sm">
                    <BadgeText>주의사항</BadgeText>
                  </Badge>
                  <Text size="sm" className="text-warning-700">
                    {warning}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
        {cardOptions.length > 0 ? (
          <CardsOrganism options={cardOptions} />
        ) : (
          <Box className="p-3">
            <Text size="md" className="text-secondary-500 text-center">
              추천된 영양제가 없습니다.
            </Text>
          </Box>
        )}
      </ScrollView>
      <Buttons placement="bottom" direction="vertical" buttons={buttons} />
    </Box>
  );
};

export default OnboardingResultScreen;
