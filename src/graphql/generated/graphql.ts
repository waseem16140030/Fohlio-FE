import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
  UseMutationOptions,
} from "@tanstack/react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("http://localhost:3000/", {
      method: "POST",
      ...{
        headers: {
          "Content-Type": "application/json",
          "x-my-header": "SomeValue",
        },
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Metadata = {
  __typename?: "Metadata";
  page: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  createUser: User;
};

export type MutationCreateUserArgs = {
  country: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  role: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
};

export type PaginationInput = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  users: UsersResponse;
};

export type QueryUsersArgs = {
  filters?: InputMaybe<UserFilters>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SortInput>;
};

export type SortInput = {
  field?: InputMaybe<Scalars["String"]["input"]>;
  order?: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
  __typename?: "User";
  country?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  phone?: Maybe<Scalars["String"]["output"]>;
  registrationDate?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
};

export type UserFilters = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type UsersResponse = {
  __typename?: "UsersResponse";
  data: Array<User>;
  metadata: Metadata;
};

export type GetUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filters?: InputMaybe<UserFilters>;
  sort?: InputMaybe<SortInput>;
}>;

export type GetUsersQuery = {
  __typename?: "Query";
  users: {
    __typename?: "UsersResponse";
    data: Array<{
      __typename?: "User";
      id: string;
      name: string;
      email: string;
      role?: string | null;
      status?: string | null;
      registrationDate?: string | null;
      phone?: string | null;
      country?: string | null;
    }>;
    metadata: {
      __typename?: "Metadata";
      total: number;
      page: number;
      pageSize: number;
    };
  };
};

export type CreateUserMutationVariables = Exact<{
  name: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  country: Scalars["String"]["input"];
  role: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser: {
    __typename?: "User";
    id: string;
    name: string;
    email: string;
    role?: string | null;
    status?: string | null;
    phone?: string | null;
    country?: string | null;
    registrationDate?: string | null;
  };
};

export const GetUsersDocument = `
    query GetUsers($pagination: PaginationInput, $filters: UserFilters, $sort: SortInput) {
  users(pagination: $pagination, filters: $filters, sort: $sort) {
    data {
      id
      name
      email
      role
      status
      registrationDate
      phone
      country
    }
    metadata {
      total
      page
      pageSize
    }
  }
}
    `;

export const useGetUsersQuery = <TData = GetUsersQuery, TError = unknown>(
  variables?: GetUsersQueryVariables,
  options?: Omit<UseQueryOptions<GetUsersQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<GetUsersQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetUsersQuery, TError, TData>({
    queryKey: variables === undefined ? ["GetUsers"] : ["GetUsers", variables],
    queryFn: fetcher<GetUsersQuery, GetUsersQueryVariables>(
      GetUsersDocument,
      variables,
    ),
    ...options,
  });
};

useGetUsersQuery.getKey = (variables?: GetUsersQueryVariables) =>
  variables === undefined ? ["GetUsers"] : ["GetUsers", variables];

export const useInfiniteGetUsersQuery = <
  TData = InfiniteData<GetUsersQuery>,
  TError = unknown,
>(
  variables: GetUsersQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetUsersQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<
      GetUsersQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useInfiniteQuery<GetUsersQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey:
          (optionsQueryKey ?? variables === undefined)
            ? ["GetUsers.infinite"]
            : ["GetUsers.infinite", variables],
        queryFn: (metaData) =>
          fetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, {
            ...variables,
            ...(metaData.pageParam ?? {}),
          })(),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetUsersQuery.getKey = (variables?: GetUsersQueryVariables) =>
  variables === undefined
    ? ["GetUsers.infinite"]
    : ["GetUsers.infinite", variables];

useGetUsersQuery.fetcher = (variables?: GetUsersQueryVariables) =>
  fetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, variables);

export const CreateUserDocument = `
    mutation CreateUser($name: String!, $email: String!, $phone: String!, $country: String!, $role: String!, $status: String!) {
  createUser(
    name: $name
    email: $email
    phone: $phone
    country: $country
    role: $role
    status: $status
  ) {
    id
    name
    email
    role
    status
    phone
    country
    registrationDate
  }
}
    `;

export const useCreateUserMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateUserMutation,
    TError,
    CreateUserMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateUserMutation,
    TError,
    CreateUserMutationVariables,
    TContext
  >({
    mutationKey: ["CreateUser"],
    mutationFn: (variables?: CreateUserMutationVariables) =>
      fetcher<CreateUserMutation, CreateUserMutationVariables>(
        CreateUserDocument,
        variables,
      )(),
    ...options,
  });
};

useCreateUserMutation.fetcher = (variables: CreateUserMutationVariables) =>
  fetcher<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
    variables,
  );
