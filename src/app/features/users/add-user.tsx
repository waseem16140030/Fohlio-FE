"use client";
import { useGlobalNotification } from "@/app/providers";
import { FOModal, MyModalRef, OnConfirmProps, userSchema } from "@/app/shared";
import {
  CreateUserMutationVariables,
  useCreateUserMutation,
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { UserAddOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { Ref } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AddUserForm } from "./add-user-form";

export interface AddUserProps {
  modalRef?: Ref<MyModalRef>;
}

export function AddUser({ modalRef }: AddUserProps) {
  //Hooks
  const queryClient = useQueryClient();
  const { openNotification } = useGlobalNotification();

  //Form Hooks
  const methods = useForm<CreateUserMutationVariables>({
    resolver: yupResolver(userSchema),
    mode: "all",
  });
  const { trigger, reset, getValues } = methods;

  //Mutation
  const { mutateAsync: createNewUser, isPending } = useCreateUserMutation({
    onSuccess: () => {
      openNotification({
        type: "success",
        description: "User has been added successfully!",
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
        description: error?.message ?? "Failed to create user",
      });
    },
  });

  const handleAddNewUser = async ({ onClose }: OnConfirmProps) => {
    const isValid = await trigger();
    if (!isValid) return;
    try {
      const values = getValues();
      await createNewUser(values);
      onClose?.();
    } catch (error) {
      throw error;
    }
  };

  return (
    <FOModal
      okButtonProps={{
        icon: <UserAddOutlined />,
      }}
      width={700}
      ref={modalRef}
      title="Add New User"
      okText="Yes, Add"
      maskClosable={false}
      confirmLoading={isPending}
      onCancel={reset}
      onConfirm={handleAddNewUser}
      afterClose={reset}
    >
      <FormProvider {...methods}>
        <AddUserForm />
      </FormProvider>
    </FOModal>
  );
}
