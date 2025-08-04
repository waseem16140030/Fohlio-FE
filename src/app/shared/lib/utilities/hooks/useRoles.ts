import { SelectProps } from "antd";
import { useMemo } from "react";

export function useRoles(): SelectProps["options"] {
  return useMemo(
    () => [
      { label: "Admin", value: "admin" },
      { label: "Manager", value: "manager" },
      { label: "User", value: "user" },
    ],
    []
  );
}
