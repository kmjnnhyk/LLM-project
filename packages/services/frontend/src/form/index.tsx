import {
  FormProvider as ReactFormProvider,
  useForm as useReactForm,
  useFormContext,
  type FieldValues,
  type PathValue,
  type DefaultValues,
  Controller,
  ControllerRenderProps,
  type ControllerFieldState,
  type FieldPath,
  RegisterOptions,
  type Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode } from 'react';

export interface FormProviderProps<T extends FieldValues> {
  children: ReactNode;
  defaultValues?: DefaultValues<T>;
  resolver?: Resolver<T>;
}

export function FormProvider<T extends FieldValues>({
  children,
  defaultValues,
  resolver,
}: FormProviderProps<T>) {
  const methods = useReactForm<T>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver,
  });
  return <ReactFormProvider {...methods}>{children}</ReactFormProvider>;
}

export const resolver = zodResolver;

export const Field = <FieldValues, FieldName extends FieldPath<FieldValues>>({
  name,
  render,
  rules,
}: {
  name: FieldName;
  rules?: RegisterOptions<FieldValues, FieldName>;
  render: (props: {
    field: {
      value: ControllerRenderProps<FieldValues, FieldName>['value'];
      onChange: (value: PathValue<FieldValues, FieldName>) => void;
    };
    fieldState: Omit<ControllerFieldState, 'error'> & {
      isRequired: boolean;
      error?: { message: string; type: string };
    };
  }) => React.ReactElement;
}) => {
  const { control } = useFormContext<FieldValues>();
  const isRequired = Boolean(rules?.required);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) =>
        render({
          field,
          fieldState: {
            ...fieldState,
            isRequired,
            error: fieldState.error && {
              message: fieldState.error.message,
              type: fieldState.error.type,
            },
          },
        })
      }
    />
  );
};

export const useForm = <T extends FieldValues>() => {
  const context = useFormContext<T>();

  return context;
};
