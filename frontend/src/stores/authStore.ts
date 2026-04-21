"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UserProfile } from "@/types/api";

interface AuthState {
  accessToken: string | null;
  organization: { id: string; name: string; slug: string } | null;
  user: UserProfile | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setSession: (payload: {
    accessToken: string;
    organization: { id: string; name: string; slug: string };
    user: UserProfile;
  }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      organization: null,
      user: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setSession: ({ accessToken, organization, user }) => set({ accessToken, organization, user }),
      clearSession: () => set({ accessToken: null, organization: null, user: null })
    }),
    {
      name: "dociq-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken, organization, user }) => ({ accessToken, organization, user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

