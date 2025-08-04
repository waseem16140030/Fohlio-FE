import { useGetUsersQuery } from "@/graphql/generated/graphql";
import { UsersList, UsersHeading } from "./features";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Hydrate } from "@/app/providers";
import { Suspense } from "react";
import { Skeleton } from "antd";

interface UserManagementProps {
  searchParams: Promise<{
    current?: string;
    pageSize?: string;
    search?: string;
    role?: string;
  }>;
}

export default async function UserManagement({
  searchParams,
}: UserManagementProps) {
  const params = await searchParams;
  const current = Number(params?.current ?? 1);
  const pageSize = Number(params?.pageSize ?? 10);
  const searchValue = params?.search;
  const roleFilter = params.role;

  const pagination = {
    page: current,
    pageSize,
  };

  const filters = {
    email: searchValue,
    role: roleFilter,
  };

  const queryClient = new QueryClient();

  const queryKey = useGetUsersQuery.getKey({ pagination, filters });
  const queryFn = useGetUsersQuery.fetcher({ pagination, filters });

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense
      fallback={
        <Skeleton
          active
          paragraph={{
            rows: 10,
          }}
        />
      }
    >
      <Hydrate state={dehydratedState}>
        <div className="tw:flex tw:flex-col tw:gap-y-4 tw:md:gap-y-6 tw:h-full">
          <UsersHeading />
          <UsersList />
        </div>
      </Hydrate>
    </Suspense>
  );
}
