"use client";
import { Typography } from "antd";

export function UsersHeading() {
  const { Text, Title } = Typography;
  return (
    <div>
      <Title className="tw:!mb-1" level={3}>
        User Management
      </Title>
      <Text className="tw:!mb-0" type="secondary">
        Manage and view user profiles.
      </Text>
    </div>
  );
}
