"use client";

import {
  formatDate,
  SearchInput,
  userRoleColorMap,
  userRoleIconMap,
  userStatusColorMap,
} from "@/app/shared";
import { useGetUsersQuery, User } from "@/graphql/generated/graphql";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import { capitalize } from "lodash";
import { EditTwoTone, EyeTwoTone, UserAddOutlined } from "@ant-design/icons";
import React from "react";
import {
  usePaginatedQueryParams,
  useRoles,
} from "@/app/shared/lib/utilities/hooks";

export function UsersList() {
  const {
    handleSearch,
    onTableChange,
    handleSelectChange,
    search,
    current,
    pageSize,
    selectedFilters,
  } = usePaginatedQueryParams({ filterKeys: ["role"] });

  const roles = useRoles();

  const paginationParams = {
    page: current,
    pageSize,
  };

  const filterParams = {
    email: search,
    role: selectedFilters?.role,
  };
  const queryKey = useGetUsersQuery.getKey({
    pagination: paginationParams,
    filters: filterParams,
  });
  const queryFn = useGetUsersQuery.fetcher({
    pagination: paginationParams,
    filters: filterParams,
  });
  const { data: userData, isLoading } = useSuspenseQuery({
    queryKey,
    queryFn,
  });
  const {
    users: { data, metadata },
  } = userData ?? {};

  const { Text } = Typography;
  const { token } = theme.useToken();

  const userColumns: TableProps<User>["columns"] = [
    {
      key: "name",
      dataIndex: "name",
      title: "Name",
      render: (_, { name }, index) => (
        <Space size={4}>
          <Avatar
            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
          />
          <Text className="tw:!mb-0">{name}</Text>
        </Space>
      ),
    },
    {
      key: "email",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "phone",
      dataIndex: "phone",
      title: "Phone",
    },
    {
      key: "country",
      dataIndex: "country",
      title: "Country",
    },
    {
      key: "registrationDate",
      dataIndex: "registrationDate",
      title: "Registration Date",
      render: (_, { registrationDate }) => (
        <Tooltip title={registrationDate}>
          {formatDate(registrationDate ?? "")}
        </Tooltip>
      ),
    },
    {
      key: "role",
      dataIndex: "role",
      title: "Role",
      align: "center",
      render: (_, { role }) => (
        <Tag
          className="tw:!m-0"
          color={userRoleColorMap[role ?? ""]}
          icon={React.createElement(userRoleIconMap[role ?? ""])}
        >
          {capitalize(role ?? "")}
        </Tag>
      ),
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      align: "center",
      render: (_, { status }) => (
        <Tag className="tw:!m-0" color={userStatusColorMap[status ?? ""]}>
          {capitalize(status ?? "")}
        </Tag>
      ),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Actions",
      align: "center",
      fixed: "right",
      render: () => (
        <Space size={0}>
          <Button type="text">
            <EyeTwoTone twoToneColor={token.colorSuccess} />
          </Button>
          <Button type="text">
            <EditTwoTone twoToneColor={token.colorInfo} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card size="small" variant="borderless" className="tw:h-full">
      <div className="tw:flex tw:flex-col tw:gap-y-4 tw:lg:gap-y-5 tw:md:p-3">
        <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-[1fr_auto] tw:lg:grid-cols-[0.7fr_auto] tw:gap-4 tw:items-center">
          <div className="tw:order-2 tw:sm:order-1 tw:flex tw:items-center tw:gap-x-2">
            <SearchInput
              defaultValue={search}
              placeholder="Search users by email..."
              onChange={handleSearch}
            />
            <Select
              options={roles}
              defaultValue={selectedFilters?.role}
              onChange={(value) => handleSelectChange("role", value)}
              allowClear
              className="tw:sm:w-60"
              placeholder="Select role"
            />
          </div>
          <div className="tw:order-1 tw:justify-self-end tw:sm:order-2">
            <Button type="primary" icon={<UserAddOutlined />}>
              Add User
            </Button>
          </div>
        </div>
        <Table<User>
          onChange={onTableChange}
          loading={isLoading}
          columns={userColumns}
          dataSource={data}
          rowKey="id"
          pagination={{
            total: metadata.total,
            pageSize,
            current,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </Card>
  );
}
