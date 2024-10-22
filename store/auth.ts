import { type StateCreator, create } from 'zustand';
import { UserStore } from '@/interfaces/User';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

interface AuthStore {
  userAuth: UserStore | null;
  setUserAuth: (user: UserStore | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  logout: () => void;
}

const getCookieUser = (): UserStore | null => {
  const user = getCookie('userAuth');
  return user ? JSON.parse(user as string) : null;
};

const storeAPI: StateCreator<AuthStore> = (set) => ({
  userAuth: getCookieUser(),
  setUserAuth: (user: UserStore | null) => {
    if (user) {
      setCookie('userAuth', JSON.stringify(user), { maxAge: 8 * 60 * 60 });
    } else {
      deleteCookie('userAuth');
    }
    set({ userAuth: user });
  },
  isLoggedIn: Boolean(getCookieUser()),
  setIsLoggedIn: (status: boolean) => set({ isLoggedIn: status }),
  logout: () => {
    deleteCookie('userAuth');
    set({ userAuth: null, isLoggedIn: false });
  },
});

const useAuthStore = create<AuthStore>(storeAPI);

export { useAuthStore };
