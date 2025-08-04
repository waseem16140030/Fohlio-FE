"use client";
import { Controller, useFormContext } from "react-hook-form";
import { Input, InputProps, Typography } from "antd";

export interface InputFieldProps extends InputProps {
  name: string;
  label?: string;
}
export function InputField({ name, label, ...restProps }: InputFieldProps) {
  const { control } = useFormContext();
  const { Text } = Typography;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="tw:flex tw:flex-col tw:gap-y-1">
          {label && (
            <label htmlFor={name}>
              <Text>{label}</Text>
            </label>
          )}
          <Input
            {...restProps}
            {...field}
            status={error ? "error" : undefined}
          />
          {error && (
            <Text type="danger" className="tw:!text-sm">
              {error.message}
            </Text>
          )}
        </div>
      )}
    />
  );
}
