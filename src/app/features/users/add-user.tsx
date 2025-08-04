"use client";
import {
  FOModal,
  InputField,
  MyModalRef,
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

export interface AddUserProps {
  modalRef?: Ref<MyModalRef>;
}

export function AddUser({ modalRef }: AddUserProps) {
  const queryClient = useQueryClient();
  const queryKey = useGetUsersQuery.getKey();
  const { roles, countries, statuses } = useUserOptions();
  const { mutateAsync, isPending } = useCreateUserMutation();

  const methods = useForm<CreateUserMutationVariables>({
    resolver: yupResolver(userSchema),
    mode: "all",
  });

  const { handleSubmit, trigger, reset } = methods;

  const onSubmit = async (data: CreateUserMutationVariables) => {
    const isValid = await trigger();
    if (!isValid) return false;
    try {
      const response = await mutateAsync(data);
      await queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
      console.log(response);

      reset();
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    reset();
  };

  return (
    <FOModal
      okButtonProps={{
        icon: <UserAddOutlined />,
        loading: isPending,
      }}
      width={700}
      ref={modalRef}
      title="Add New User"
      okText="Yes, Add"
      maskClosable={false}
      onCancel={handleClose}
      onConfirm={async () => {
        const isValid = await trigger();
        if (!isValid) return isValid;
        await handleSubmit(onSubmit)();
        return isValid;
      }}
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
