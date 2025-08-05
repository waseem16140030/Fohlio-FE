import { useGlobalNotification } from "@/app/providers";
import {
  useEditUserRoleMutation,
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { useQueryClient } from "@tanstack/react-query";

export interface ChangeRoleProps {
  role: string;
  id: string;
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  const { openNotification } = useGlobalNotification();
  const { mutateAsync: changeUerRole, isPending } = useEditUserRoleMutation({
    onSuccess: () => {
      openNotification({
        type: "success",
        description: "User role has been updated successfully!",
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

  const handleUpdateRole = async (values: ChangeRoleProps) => {
    try {
      await changeUerRole(values);
    } catch (error) {
      throw error;
    }
  };

  return {
    handleUpdateRole,
    isPending,
  };
}
