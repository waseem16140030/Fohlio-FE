import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/graphql/generated/graphql";
import { generateMockUsers } from "@/app/mocks";

interface UserStore {
  users: User[];
  getUsers: () => User[];
  addUser: (user: User) => void;
  removeUserById: (id: string) => void;
  updateUserRole: (id: string, role: User["role"]) => void;
  updateUserById: (id: string, newData: Partial<User>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      getUsers: () => get().users,
      addUser: (user: User) => {
        set((state) => ({ ...state, users: [user, ...state.users] }));
      },
      removeUserById: (id: string) => {
        set((state) => ({
          ...state,
          users: state.users.filter((user) => user.id !== id),
        }));
      },
      updateUserRole: (id, role) => {
        set((state) => ({
          ...state,
          users: state.users.map((user) =>
            user.id === id ? { ...user, role } : user
          ),
        }));
      },
      updateUserById: (id: string, newData: Partial<User>) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...newData } : user
          ),
        }));
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (state && state.users.length === 0) {
            state.users = generateMockUsers();
          }
        };
      },
    }
  )
);
