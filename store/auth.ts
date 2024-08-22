import {persist} from 'zustand/middleware';
import {type StateCreator, create} from 'zustand';
import {User} from '@/interfaces/User'

interface AuthStore {
  userAuth: User;
  setUserAuth: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: () => void;
}

const storeAPI: StateCreator<AuthStore> = (set, get) => ({
  userAuth: {
    id: '',
    name: '',
    lastName: '',
    email: '',
    roleId: 0,
    roleName: '',
  },
  setUserAuth: (user: User) => set({ userAuth: user ?? get().userAuth }),
  isLoggedIn: false,
  setIsLoggedIn: () => {
    const {isLoggedIn} = get();
    set({isLoggedIn: !isLoggedIn});
  },
});

const useAuthStore = create<AuthStore>()(
  persist(
    storeAPI,
    {
      name: 'auth-store',
    })
);

export {useAuthStore}
