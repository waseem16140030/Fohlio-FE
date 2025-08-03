import { useGetUsersQuery } from "@/graphql/generated/graphql";
import { Users } from "./features";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import {Hydrate} from "@/app/providers";

export default async function Home() {
  
const queryClient=new QueryClient()
  const variables = {
    pagination: { page: 1, pageSize: 100 },
    filters: undefined,
    sort: undefined,
  };

  const queryKey = useGetUsersQuery.getKey(variables);
  const queryFn = useGetUsersQuery.fetcher(variables);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <Hydrate state={dehydratedState} >
      <Users variables={variables}  />
      </Hydrate>
    </div>
  );
}
