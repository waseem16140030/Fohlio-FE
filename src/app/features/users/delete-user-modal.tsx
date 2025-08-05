import { useGlobalNotification } from "@/app/providers";
import { FOModal, MyModalRef, OnConfirmProps } from "@/app/shared";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "antd";
import { Ref } from "react";

export interface DeleteUserProps {
  userId: string;
}

export interface DeleteUserModalProps {
  modalRef: Ref<MyModalRef<DeleteUserProps>>;
}

export function DeleteUserModal({ modalRef }: DeleteUserModalProps) {
  const { Title, Text } = Typography;

  //Hooks
  const queryClient = useQueryClient();
  const { openNotification } = useGlobalNotification();

  const { mutateAsync: deleteUser, isPending } = useDeleteUserMutation({
    onSuccess: () => {
      openNotification({
        type: "success",
        description: "User has been deleted successfully!",
      });
      queryClient.invalidateQueries({
        queryKey: useGetUsersQuery.getKey(),
        exact: false,
      });
    },
    onError: (error: Error) => {
      openNotification({
        type: "error",
        description: error.message ?? "Failed to delete user",
      });
    },
  });

  const handleDelete = async ({
    data,
    onClose,
  }: OnConfirmProps<DeleteUserProps>) => {
    const userId = data?.userId;
    if (!userId) return;
    try {
      await deleteUser({ id: userId });
      onClose?.();
    } catch (error) {
      throw error;
    }
  };

  return (
    <FOModal
      ref={modalRef}
      title="Delete User"
      okText="Yes, Confirm"
      confirmLoading={isPending}
      onConfirm={handleDelete}
    >
      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-48">
        <Title className="tw:!mb-1" level={5}>
          Are you sure you want to delete this user?
        </Title>
        <Text type="secondary">
          All user data and account will be permanently deleted.
        </Text>
      </div>
    </FOModal>
  );
}
