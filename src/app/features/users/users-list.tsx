"use client";
import {
  formatDate,
  MyModalRef,
  SearchInput,
  userRoleColorMap,
  userRoleIconMap,
  userStatusColorMap,
} from "@/app/shared";
import { useGetUsersQuery, User } from "@/graphql/generated/graphql";
import { useQuery } from "@tanstack/react-query";
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
import { DeleteTwoTone, EditTwoTone, UserAddOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import {
  useChangeUserRole,
  usePaginatedQueryParams,
  useUserOptions,
} from "@/app/shared/lib/utilities/hooks";
import { AddUser, DeleteUserModal, DeleteUserProps } from ".";

export function UsersList() {
  const { Text } = Typography;
  //State and Refs
  const [UserId, setUserId] = useState<string | null>(null);
  const modalRef = useRef<MyModalRef>(null);
  const deleteModalRef = useRef<MyModalRef<DeleteUserProps>>(null);

  //Hooks
  const { token } = theme.useToken();
  const {
    handleSearch,
    onTableChange,
    handleSelectChange,
    search,
    current,
    pageSize,
    selectedFilters,
    sortField,
    sortOrder,
  } = usePaginatedQueryParams({ filterKeys: ["role"] });

  const queryKey = useGetUsersQuery.getKey({
    pagination: { page: current, pageSize },
    filters: { role: selectedFilters.role, email: search },
    sort: { field: sortField, order: sortOrder },
  });
  const queryFn = useGetUsersQuery.fetcher({
    pagination: { page: current, pageSize },
    filters: { role: selectedFilters.role, email: search },
    sort: { field: sortField, order: sortOrder },
  });
  const { data: userData, isLoading } = useQuery({
    queryKey,
    queryFn,
  });
  const { roles } = useUserOptions();
  const { handleUpdateRole, isPending } = useChangeUserRole();

  //data
  const { users } = userData ?? {};
  const { data, metadata } = users ?? {};

  //Columns
  const userColumns: TableProps<User>["columns"] = [
    {
      key: "name",
      dataIndex: "name",
      title: "Name",
      sorter: true,
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
      sorter: true,
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
      width: 130,
      align: "center",
      render: (_, { role, id }) => {
        const isEditing = UserId === id;
        const color = userRoleColorMap[role!] ?? "default";
        const icon = React.createElement(userRoleIconMap[role ?? ""]);
        return isEditing ? (
          <Select
            variant="borderless"
            showSearch
            size="small"
            loading={isPending}
            onChange={(value) => {
              handleUpdateRole({ id, role: value });
              setUserId(null);
            }}
            className="tw:!w-24"
            value={role}
            options={roles}
            onBlur={() => setUserId(null)}
          />
        ) : (
          <Tooltip title="Click me to edit role">
            <Tag
              className="tw:!m-0 tw:cursor-pointer"
              color={color}
              icon={icon}
              onClick={() => setUserId(id)}
            >
              {capitalize(role ?? "")}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      align: "center",
      render: (_, { status }) => {
        const color = userStatusColorMap[status!] ?? "default";
        return (
          <Tag className="tw:!m-0" color={color}>
            {capitalize(status ?? "")}
          </Tag>
        );
      },
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Actions",
      align: "center",
      fixed: "right",
      render: (_, { id }) => (
        <Space size={0}>
          <Button
            type="text"
            onClick={() => {
              deleteModalRef.current?.open({ userId: id });
            }}
          >
            <DeleteTwoTone twoToneColor={token.colorError} />
          </Button>
          <Button type="text">
            <EditTwoTone twoToneColor={token.colorInfo} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
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
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => {
                  modalRef.current?.open();
                }}
              >
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
              total: metadata?.total,
              pageSize,
              current,
            }}
            scroll={{ x: "max-content" }}
          />
        </div>
      </Card>
      <AddUser modalRef={modalRef} />
      <DeleteUserModal modalRef={deleteModalRef} />
    </>
  );
}
