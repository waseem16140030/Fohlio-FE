"use client";
import {
  FOModal,
  InputField,
  MyModalRef,
  OnConfirmProps,
  SelectField,
  userSchema,
} from "@/app/shared";
import {
  CreateUserMutationVariables,
  useCreateUserMutation,
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import { Ref } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { UserAddOutlined } from "@ant-design/icons";
import { useUserOptions } from "@/app/shared/lib/utilities/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalNotification } from "@/app/providers";

export interface AddUserProps {
  modalRef?: Ref<MyModalRef>;
}

export function AddUser({ modalRef }: AddUserProps) {
  //Hooks
  const queryClient = useQueryClient();
  const { openNotification } = useGlobalNotification();
  const { roles, countries, statuses } = useUserOptions();

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

  const handleClose = () => {
    reset();
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
      onCancel={handleClose}
      onConfirm={handleAddNewUser}
      afterClose={reset}
    >
      <FormProvider {...methods}>
        <form
          className="tw:flex tw:flex-col tw:gap-y-5 tw:!my-4"
          id="add-user-form"
        >
          <InputField name="name" label="Name" placeholder="Enter your name" />
          <InputField
            name="email"
            label="Email"
            placeholder="Enter your email"
          />
          <InputField
            name="phone"
            label="Phone"
            placeholder="Enter your phone"
          />
          <SelectField
            name="country"
            label="Country"
            placeholder="Select country"
            options={countries}
          />
          <SelectField
            name="role"
            label="Role"
            placeholder="Select role"
            options={roles}
          />
          <SelectField
            name="status"
            label="Status"
            placeholder="Select status"
            options={statuses}
          />
        </form>
      </FormProvider>
    </FOModal>
  );
}
