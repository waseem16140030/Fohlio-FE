'use client';

import { useGetUsersQuery, GetUsersQueryVariables } from '@/graphql/generated/graphql';

export function Users({ variables }: { variables: GetUsersQueryVariables }) {
  const { data, isLoading, error } = useGetUsersQuery(variables);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <ul>
      {data?.users?.data?.map((user) => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}
