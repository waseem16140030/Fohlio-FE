import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/graphql/generated/graphql";
import { generateMockUsers } from "@/app/mocks";

interface UserStore {
  users: User[];
  getUsers: () => User[];
  addUser: (user: User) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: generateMockUsers() ?? [],
      getUsers: () => get().users,
      addUser: (user: User) => {
        set((state) => ({ ...state, users: [user, ...state.users] }));
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
