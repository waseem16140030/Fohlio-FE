import { graphql, HttpResponse, delay } from "msw";
import { mockUsers } from "./db";
import {
  GetUsersQuery,
  GetUsersQueryVariables,
} from "@/graphql/generated/graphql";

export const handlers = [
  graphql.query<GetUsersQuery, GetUsersQueryVariables>(
    "GetUsers",
    async ({ variables }) => {
      try {
        await delay(300);

        const {
          pagination = { page: 1, pageSize: 10 },
          filters = {},
          sort = { field: "registrationDate", order: "DESC" },
        } = variables ?? {};

        const page = pagination?.page ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        const { email, role, status } = filters ?? {};

        const field = sort?.field ?? "registrationDate";
        const order = sort?.order ?? "DESC";

        const filteredUsers = [...mockUsers].filter((user) => {
          return (
            (!email ||
              user.email.toLowerCase().includes(email.toLowerCase())) &&
            (!role || user.role === role) &&
            (!status || user.status === status)
          );
        });

        filteredUsers.sort((a, b) => {
          const sortField = field as keyof typeof a;
          const aValue = a[sortField]!;
          const bValue = b[sortField]!;

          if (sortField === "registrationDate") {
            return order === "ASC"
              ? new Date(aValue).getTime() - new Date(bValue).getTime()
              : new Date(bValue).getTime() - new Date(aValue).getTime();
          }

          return order === "ASC"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        });

        const startIdx = (page - 1) * pageSize;
        const paginatedUsers = filteredUsers.slice(
          startIdx,
          startIdx + pageSize
        );

        return HttpResponse.json({
          data: {
            users: {
              data: paginatedUsers,
              metadata: {
                total: filteredUsers.length,
                page,
                pageSize,
              },
            },
          },
        });
      } catch (error) {
        console.error("Mock API Error:", error);
        return HttpResponse.json(
          { errors: [{ message: "Internal server error" }] },
          { status: 500 }
        );
      }
    }
  ),
];
