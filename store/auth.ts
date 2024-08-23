import { persist } from 'zustand/middleware';
import { type StateCreator, create } from 'zustand';
import { User } from '@/interfaces/User'

interface AuthStore {
  userAuth: User | null;
  setUserAuth: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  logout: () => void;
}

const initialUserState: User = {
  id: '',
  name: '',
  lastName: '',
  email: '',
  roleId: 0,
  roleName: '',
};

const storeAPI: StateCreator<AuthStore> = (set) => ({
  userAuth: null,
  setUserAuth: (user: User | null) => set({ userAuth: user }),
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
