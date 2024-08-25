import { persist } from 'zustand/middleware';
import { type StateCreator, create } from 'zustand';
import { UserStore } from '@/interfaces/User'

interface AuthStore {
  userAuth: UserStore | null;
  setUserAuth: (user: UserStore | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  logout: () => void;
}

// const initialUserState: UserStore = {
//   id: "920959db-c4fe-482e-83bf-ea4fce08c215",
//   name: "Will",
//   lastName: "Zapata",
//   email: "will@example.com",
//   roleId: 1,
// };

const storeAPI: StateCreator<AuthStore> = (set) => ({
  userAuth: null,
  setUserAuth: (user: UserStore | null) => set({ userAuth: user }),
  isLoggedIn: false,
  setIsLoggedIn: (status: boolean) => set({ isLoggedIn: status }),
  logout: () => set({ userAuth: null, isLoggedIn: false }),
});

const useAuthStore = create<AuthStore>()(
  persist(
    storeAPI,
    {
      name: 'auth-store',
    }
  )
);

export { useAuthStore };
