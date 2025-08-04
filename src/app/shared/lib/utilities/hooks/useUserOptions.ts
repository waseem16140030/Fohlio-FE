import { SelectProps } from "antd";
import { useMemo } from "react";

export function useUserOptions(): {
  roles: SelectProps["options"];
  countries: SelectProps["options"];
  statuses: SelectProps["options"];
} {
  const roles = useMemo<SelectProps["options"]>(
    () => [
      { label: "Admin", value: "admin" },
      { label: "Manager", value: "manager" },
      { label: "User", value: "user" },
    ],
    []
  );

  const countries = useMemo<SelectProps["options"]>(
    () => [
      { label: "USA", value: "USA" },
      { label: "UK", value: "UK" },
      { label: "Canada", value: "Canada" },
      { label: "Germany", value: "Germany" },
    ],
    []
  );

  const statuses = useMemo<SelectProps["options"]>(
    () => [
      { label: "Active", value: "active" },
      { label: "Banned", value: "banned" },
      { label: "Pending", value: "pending" },
    ],
    []
  );

  return {
    roles,
    countries,
    statuses,
  };
}
