"use client";

import { create } from "zustand";

interface UiState {
  desktopSidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  desktopSidebarCollapsed: false,
  mobileSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        return { mobileSidebarOpen: !state.mobileSidebarOpen };
      }

      return { desktopSidebarCollapsed: !state.desktopSidebarCollapsed };
    }),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false })
}));

