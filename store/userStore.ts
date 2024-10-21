import { create } from 'zustand'

interface UserStudent {
  fullName: string
  email: string
}

interface UserStore {
  userSimulator: UserStudent
  setUserSimulator: (user: UserStudent) => void
}

export const useUserStore = create<UserStore>((set) => ({
  userSimulator: {
    fullName: '',
    email: '',
  },
  setUserSimulator: (user) => set({ userSimulator: user }),
}))
