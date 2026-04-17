"use client";

import { create } from "zustand";

import { UserProfile } from "@/types/api";

interface AuthState {
  accessToken: string | null;
  organization: { id: string; name: string; slug: string } | null;
  user: UserProfile | null;
  setSession: (payload: {
    accessToken: string;
    organization: { id: string; name: string; slug: string };
    user: UserProfile;
  }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  organization: null,
  user: null,
  setSession: ({ accessToken, organization, user }) => set({ accessToken, organization, user }),
  clearSession: () => set({ accessToken: null, organization: null, user: null })
}));

