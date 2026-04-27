// import { shared } from 'use-broadcast-ts'
import type { IUser } from '@/apis/user/types'
import { isServer } from '@/lib/utils'
import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IAuthStoreCredentials {
  user: IUser | null
  accessToken: string | null
}

export interface IAuthStoreStates extends IAuthStoreCredentials {
  setAccessToken: (accessToken: string | null) => any
  setProfile: (profile: IUser) => any
  resetCredentials: () => void
}

const initialState: IAuthStoreCredentials = { user: null, accessToken: null }

const storeInitializer: StateCreator<IAuthStoreStates, []> = (set, get) => ({
  ...initialState,
  setProfile: (profile: IUser) => {
    const state = get()
    set({ ...state, user: profile })
  },
  setAccessToken: (accessToken) => {
    const state = get()
    console.log('Set token in Zustand store')
    set({ ...state, accessToken })
  },
  resetCredentials: () => {
    set(initialState)
  },
})

export const useAuthStore = isServer
  ? create(storeInitializer)
  : create(
      persist(storeInitializer, {
        name: 'credentials',
      })
    )
