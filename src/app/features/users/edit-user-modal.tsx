"use client";
import { FOModal, MyModalRef, OnConfirmProps, userSchema } from "@/app/shared";
import {
  CreateUserMutationVariables,
  useEditUserMutation,
  useGetUsersQuery,
  User,
} from "@/graphql/generated/graphql";
import { Ref, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AddUserForm } from "./add-user-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditOutlined } from "@ant-design/icons";
import { useGlobalNotification } from "@/app/providers";
import { useQueryClient } from "@tanstack/react-query";

export interface EditUserModalProp {
  modalRef: Ref<MyModalRef<User>>;
}
export function EditUserModal({ modalRef }: EditUserModalProp) {
  const [userData, setUserData] = useState<User>();
  const queryClient = useQueryClient();
  const { openNotification } = useGlobalNotification();
  //Form Hooks
  const methods = useForm<CreateUserMutationVariables>({
    resolver: yupResolver(userSchema),
    mode: "all",
  });
  const { trigger, reset, getValues } = methods;

  useEffect(() => {
    if (userData) {
      reset({
        name: userData?.name,
        email: userData?.email,
        status: userData?.status ?? "",
        phone: userData?.phone ?? "",
        country: userData?.country ?? "",
        role: userData?.role ?? "",
      });
    }
  }, [userData, reset]);

  const { mutateAsync: EditUser, isPending } = useEditUserMutation({
    onSuccess: () => {
      openNotification({
        type: "success",
        description: "User has been updated successfully!",
      });
      reset();
      queryClient.invalidateQueries({
        queryKey: useGetUsersQuery.getKey(),
        exact: false,
      });
    },
    onError: (error: Error) => {
      openNotification({
        type: "error",
        description: error?.message ?? "Failed to update user",
      });
    },
  });

  const handleEditUser = async ({ onClose }: OnConfirmProps<User>) => {
    const isValid = await trigger();
    if (!isValid) return;
    try {
      const values = getValues();
      await EditUser({ input: values, id: userData?.id ?? "" });
      onClose?.();
    } catch (error) {
      throw error;
    }
  };

  return (
    <FOModal
      okButtonProps={{
        icon: <EditOutlined />,
      }}
      ref={modalRef}
      width={700}
      title="Edit User"
      okText="Yes, Edit"
      maskClosable={false}
      confirmLoading={isPending}
      onDataReceived={(data) => {
        if (data) {
          setUserData(data);
        }
      }}
      onConfirm={handleEditUser}
      afterClose={reset}
      onCancel={reset}
    >
      <FormProvider {...methods}>
        <AddUserForm />
      </FormProvider>
    </FOModal>
  );
}
