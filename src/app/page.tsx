import { UsersList, UsersHeading } from "./features";
import { Suspense } from "react";
import { Skeleton } from "antd";

export default async function UserManagement() {
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
      <div className="tw:flex tw:flex-col tw:gap-y-4 tw:md:gap-y-6 tw:h-full">
        <UsersHeading />
        <UsersList />
      </div>
    </Suspense>
  );
}
