'use client'
import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectProps, Typography } from "antd";
export interface CFSelectFieldProps extends SelectProps {
  name: string;
  label?: string;
}
export function SelectField({ name, label, ...restProps }: CFSelectFieldProps) {
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
          <Select
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
