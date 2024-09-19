import { create } from 'zustand'

interface UserStudent {
  fullName: string
  email: string
  password: string
}

interface UserStore {
  userSimulator: UserStudent
  setUserSimulator: (user: UserStudent) => void
}

export const useUserStore = create<UserStore>((set) => ({
  userSimulator: {
    fullName: '',
    email: '',
    password: '',
  },
  setUserSimulator: (user) => set({ userSimulator: user }),
}))
