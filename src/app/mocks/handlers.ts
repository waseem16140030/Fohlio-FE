import { graphql, HttpResponse, delay } from "msw";
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
  User,
} from "@/graphql/generated/graphql";
import { nanoid } from "nanoid";
import { useUserStore } from "app/entities/stores";

export const handlers = [
  graphql.query<GetUsersQuery, GetUsersQueryVariables>(
    "GetUsers",
    async ({ variables }) => {
      try {
        const { getUsers } = useUserStore.getState();
        const allUsers = getUsers();
        // console.log(allUsers, 'allUsers')
        console.log(allUsers);
        await delay(300);

        const {
          pagination = { page: 1, pageSize: 10 },
          filters = {},
          sort = { field: "registrationDate", order: "DESC" },
        } = variables ?? {};

        // Filtering
        const filteredUsers = allUsers.filter((user) => {
          const matchesEmail =
            !filters?.email ||
            user.email.toLowerCase().includes(filters.email.toLowerCase());
          const matchesRole = !filters?.role || user.role === filters.role;
          const matchesStatus =
            !filters?.status || user.status === filters.status;
          return matchesEmail && matchesRole && matchesStatus;
        });

        // Sorting - newest first by default
        filteredUsers.sort((a, b) => {
          const field = sort?.field as keyof User;
          const aVal = a[field] as string;
          const bVal = b[field] as string;

          if (field === "registrationDate") {
            return sort?.order === "ASC"
              ? new Date(aVal).getTime() - new Date(bVal).getTime()
              : new Date(bVal).getTime() - new Date(aVal).getTime();
          }

          return sort?.order === "ASC"
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        });

        // Pagination
        const page = pagination?.page || 1;
        const pageSize = pagination?.pageSize || 10;
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
        console.error("Error fetching users:", error);
        return HttpResponse.json(
          { errors: [{ message: "Failed to fetch users" }] },
          { status: 500 }
        );
      }
    }
  ),

  graphql.mutation<CreateUserMutation, CreateUserMutationVariables>(
    "CreateUser",
    async ({ variables }) => {
      try {
        await delay(500); // Simulate network delay

        if (!variables) {
          throw new Error("No variables provided");
        }

        const { name, email, phone, country, role, status } = variables;

        // Validate required fields
        if (!name || !email || !phone || !country || !role || !status) {
          throw new Error("All fields are required");
        }

        // Create new user with current timestamp
        const newUser: User = {
          id: nanoid(),
          name,
          email,
          phone,
          country,
          role: role as User["role"],
          status: status as User["status"],
          registrationDate: new Date().toISOString(), // Current date for top position
        };

        const { addUser } = useUserStore.getState();
        addUser(newUser);
        return HttpResponse.json({
          data: {
            createUser: newUser,
          },
        });
      } catch (error) {
        console.error("Create User Error:", error);
        return HttpResponse.json(
          {
            errors: [
              {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to create user",
              },
            ],
          },
          { status: 400 }
        );
      }
    }
  ),

  graphql.mutation("DeleteUser", async ({ variables }) => {
    const { id } = variables;
    if (!id) {
      return HttpResponse.json(
        {
          errors: [
            {
              message: "User ID is required to delete a user.",
            },
          ],
        },
        { status: 400 }
      );
    }
    try {
      const { removeUserById } = useUserStore.getState();
      await delay(300);
      removeUserById(id);

      return HttpResponse.json({
        data: {
          deleteUser: true,
        },
      });
    } catch (error) {
      return HttpResponse.json(
        {
          errors: [
            {
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to delete user",
            },
          ],
        },
        { status: 400 }
      );
    }
  }),
  graphql.mutation("EditUserRole", async ({ variables }) => {
    const { id, role } = variables;

    if (!id || !role) {
      return HttpResponse.json(
        {
          errors: [{ message: "Both id and role are required." }],
        },
        { status: 400 }
      );
    }

    try {
      const { updateUserRole } = useUserStore.getState();
      await delay(300);
      updateUserRole(id, role);

      return HttpResponse.json({
        data: {
          editUserRole: {
            id,
            role,
          },
        },
      });
    } catch (error) {
      return HttpResponse.json(
        {
          errors: [
            {
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to edit user role",
            },
          ],
        },
        { status: 400 }
      );
    }
  }),
];
