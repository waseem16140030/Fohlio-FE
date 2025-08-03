import { User } from "@/graphql/generated/graphql";

export const mockUsers: User[] = Array.from({ length: 100 }, (_, i) => ({
  id: `${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  country: ["USA", "UK", "Canada", "Germany"][Math.floor(Math.random() * 4)],
  role: ["admin", "user", "manager"][
    Math.floor(Math.random() * 3)
  ] as User["role"],
  status: ["active", "banned", "pending"][
    Math.floor(Math.random() * 3)
  ] as User["status"],
  registrationDate: new Date(
    Date.now() - Math.random() * 31536000000
  ).toISOString(),
}));
