import { AlertCircleIcon, CheckIcon } from 'lucide-react-native';
import React from 'react';

import { Badge, BadgeIcon, BadgeText, IBadgeIconProps, IBadgeProps } from '../../components/badge';
import { Box } from '../../components/box';
import { Card } from '../../components/card';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '../../components/check-box';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../../components/form-control';
import { HStack } from '../../components/h-stack';
import { Heading } from '../../components/header';
import { Input, InputField } from '../../components/input';
import { Radio, RadioGroup, RadioIndicator, RadioIcon, RadioLabel } from '../../components/radio';
import { Text } from '../../components/text';
import { Textarea, TextareaInput } from '../../components/text-area';
import { VStack } from '../../components/v-stack';

export type FormFieldType = 'input' | 'textarea' | 'card' | 'radio' | 'checkbox';

type BaseFormField = {
  title?: string;
  placeholder?: string;
  isRequired?: boolean;
  error?: { message: string };
};

export type IFormField<T> =
  | (BaseFormField & {
      type: 'input' | 'textarea';
      value?: string;
      onChange: (value: string) => void;
    })
  | (BaseFormField & {
      type: 'card';
      multiselect?: boolean;
      value: T | T[];
      onChange: (value: T | T[]) => void;
      options: {
        value: T;
        label: string;
        description?: string;
        badges?: (IBadgeProps & {
          icon?: IBadgeIconProps['as'];
          label?: string;
        })[];
        expandable?:
          | { type: 'text'; label: string; content: string }
          | {
              type: 'input';
              label: string;
              placeholder: string;
              value?: string;
              onChange: (value: string) => void;
            };
      }[];
    })
  | (BaseFormField & {
      type: 'radio';
      value: T;
      onChange: (value: T) => void;
      options: {
        value: T;
        label: string;
        expandable?:
          | { type: 'text'; label: string; content: string }
          | {
              type: 'input';
              label: string;
              placeholder: string;
              value?: string;
              onChange: (value: string) => void;
            };
      }[];
      direction: 'horizontal' | 'vertical';
    })
  | (BaseFormField & {
      type: 'checkbox';
      value: T[];
      onChange: (value: T[]) => void;
      options: {
        value: T;
        label: string;
        expandable?:
          | { type: 'text'; label: string; content: string }
          | {
              type: 'input';
              label: string;
              placeholder: string;
              value?: string;
              onChange: (value: string) => void;
            };
      }[];
      direction: 'horizontal' | 'vertical';
    });

export function FormFieldOrganism<T>(props: IFormField<T>) {
  if (props.type === 'input') {
    const { value, onChange, title, isRequired, error, placeholder } = props;
    return (
      <Box className="p-3">
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText size="2xl">{title}</FormControlLabelText>}
          </FormControlLabel>
          <Input>
            <InputField placeholder={placeholder} value={value} onChangeText={onChange} />
          </Input>
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Box>
    );
  }
  if (props.type === 'textarea') {
    const { value, onChange, title, isRequired, error, placeholder } = props;
    return (
      <VStack className="w-full p-3" space="lg">
        {title && <Heading size="xl">{title}</Heading>}
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText>{title}</FormControlLabelText>}
          </FormControlLabel>
          <Textarea size="md">
            <TextareaInput placeholder={placeholder} value={value} onChangeText={onChange} />
          </Textarea>
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    );
  }

  if (props.type === 'card') {
    const { value, onChange, title, isRequired, error, options, multiselect = false } = props;
    const isMultiSelect = multiselect === true;
    const currentValue = isMultiSelect
      ? Array.isArray(value)
        ? value
        : []
      : ((value ?? '') as string);

    return (
      <VStack className="w-full p-3" space="lg">
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText size="2xl">{title}</FormControlLabelText>}
          </FormControlLabel>
          <VStack space="xl">
            {options.map((option, index) => {
              const isSelected = isMultiSelect
                ? Array.isArray(currentValue) && currentValue.includes(option.value)
                : currentValue === option.value;

              return (
                <Card key={index} variant="outline">
                  <VStack space="md">
                    <VStack space="xs" className="relative">
                      {/* Right checkbox/radio - fixed to top right */}
                      {isMultiSelect ? (
                        <CheckboxGroup
                          className="absolute right-0 top-0"
                          value={
                            Array.isArray(currentValue) ? currentValue.map((v) => String(v)) : []
                          }
                          onChange={(values) => {
                            onChange(
                              values.map((v) => {
                                const foundOption = options.find((opt) => String(opt.value) === v);
                                return foundOption ? foundOption.value : v;
                              }) as T[]
                            );
                          }}
                        >
                          <Checkbox value={String(option.value)}>
                            <CheckboxIndicator>
                              <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                          </Checkbox>
                        </CheckboxGroup>
                      ) : (
                        <RadioGroup
                          className="absolute right-0 top-0"
                          value={currentValue as string}
                          onChange={(val) => onChange(val as T)}
                        >
                          <Radio value={option.value as string}>
                            <RadioIndicator>
                              <RadioIcon />
                            </RadioIndicator>
                          </Radio>
                        </RadioGroup>
                      )}

                      {/* Left content with right margin to avoid overlap */}
                      <VStack space="xs" className="pr-8">
                        <HStack space="sm">
                          <Heading size="lg">{option.label}</Heading>
                          {option.badges && (
                            <HStack space="xs">
                              {option.badges.map((badge, badgeIndex) => (
                                <Badge
                                  key={badgeIndex}
                                  action={badge.action || 'success'}
                                  variant="solid"
                                  size="sm"
                                >
                                  <BadgeText>{badge.label}</BadgeText>
                                  {badge.icon && <BadgeIcon as={badge.icon} className="ml-2" />}
                                </Badge>
                              ))}
                            </HStack>
                          )}
                        </HStack>
                        {option.description && <Text size="sm">{option.description}</Text>}
                      </VStack>
                    </VStack>

                    {/* Expandable section */}
                    {option.expandable && isSelected && (
                      <VStack space="xs" className="bg-secondary-0 rounded p-4">
                        {option.expandable.type === 'input' && (
                          <FormControl>
                            <FormControlLabel>
                              <FormControlLabelText>{option.expandable.label}</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                              <InputField
                                placeholder={option.expandable.placeholder}
                                value={option.expandable.value}
                                onChangeText={option.expandable.onChange}
                              />
                            </Input>
                          </FormControl>
                        )}
                        {option.expandable.type === 'text' && (
                          <VStack space="xs">
                            <Text size="sm" className="font-bold">
                              {option.expandable.label}
                            </Text>
                            <Text size="sm">{option.expandable.content}</Text>
                          </VStack>
                        )}
                      </VStack>
                    )}
                  </VStack>
                </Card>
              );
            })}
          </VStack>
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    );
  }

  if (props.type === 'radio') {
    const { value, onChange, title, isRequired, error, options, direction } = props;
    return (
      <VStack className="w-full p-3" space="lg">
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText size="2xl">{title}</FormControlLabelText>}
          </FormControlLabel>
          <VStack space="md">
            <RadioGroup value={(value ?? '') as string} onChange={onChange}>
              <VStack space={direction === 'horizontal' ? 'xs' : 'sm'}>
                {direction === 'horizontal' ? (
                  <HStack space="lg">
                    {options.map((option, index) => (
                      <Radio key={index} value={option.value as string}>
                        <RadioIndicator>
                          <RadioIcon />
                        </RadioIndicator>
                        <RadioLabel>{option.label}</RadioLabel>
                      </Radio>
                    ))}
                  </HStack>
                ) : (
                  options.map((option, index) => (
                    <Radio key={index} value={option.value as string}>
                      <RadioIndicator>
                        <RadioIcon />
                      </RadioIndicator>
                      <RadioLabel>{option.label}</RadioLabel>
                    </Radio>
                  ))
                )}
              </VStack>
            </RadioGroup>

            {/* Expandable sections for selected options */}
            {options.map(
              (option, index) =>
                option.expandable &&
                value === option.value && (
                  <VStack key={`expandable-${index}`} space="xs">
                    {option.expandable.type === 'input' && (
                      <FormControl>
                        <Input>
                          <InputField
                            placeholder={option.expandable.placeholder}
                            value={option.expandable.value}
                            onChangeText={option.expandable.onChange}
                          />
                        </Input>
                      </FormControl>
                    )}
                    {option.expandable.type === 'text' && (
                      <Text size="sm">{option.expandable.content}</Text>
                    )}
                  </VStack>
                )
            )}
          </VStack>
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    );
  }

  if (props.type === 'checkbox') {
    const { value, onChange, title, isRequired, error, options, direction } = props;
    const currentValue = Array.isArray(value) ? value : [];

    return (
      <VStack className="w-full p-3" space="lg">
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControlLabel>
            {title && <FormControlLabelText size="2xl">{title}</FormControlLabelText>}
          </FormControlLabel>
          <VStack space="md">
            <CheckboxGroup
              value={currentValue.map((v) => String(v))}
              onChange={(values) => {
                onChange(
                  values.map((v) => {
                    const foundOption = options.find((opt) => String(opt.value) === v);
                    return foundOption ? foundOption.value : v;
                  }) as T[]
                );
              }}
            >
              <VStack space={direction === 'horizontal' ? 'xs' : 'sm'}>
                {direction === 'horizontal' ? (
                  <HStack space="lg">
                    {options.map((option, index) => (
                      <Checkbox key={index} value={String(option.value)}>
                        <CheckboxIndicator>
                          <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>{option.label}</CheckboxLabel>
                      </Checkbox>
                    ))}
                  </HStack>
                ) : (
                  options.map((option, index) => (
                    <Checkbox key={index} value={String(option.value)}>
                      <CheckboxIndicator>
                        <CheckboxIcon />
                      </CheckboxIndicator>
                      <CheckboxLabel>{option.label}</CheckboxLabel>
                    </Checkbox>
                  ))
                )}
              </VStack>
            </CheckboxGroup>

            {/* Expandable sections for selected options */}
            {options.map(
              (option, index) =>
                option.expandable &&
                currentValue.includes(option.value) && (
                  <VStack key={`expandable-${index}`} space="xs">
                    {option.expandable.type === 'input' && (
                      <FormControl>
                        <Input>
                          <InputField
                            placeholder={option.expandable.placeholder}
                            value={option.expandable.value}
                            onChangeText={option.expandable.onChange}
                          />
                        </Input>
                      </FormControl>
                    )}
                    {option.expandable.type === 'text' && (
                      <Text size="sm">{option.expandable.content}</Text>
                    )}
                  </VStack>
                )
            )}
          </VStack>
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    );
  }

  return null;
}
