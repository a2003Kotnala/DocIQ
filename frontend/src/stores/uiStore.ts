"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UiState {
  desktopSidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "dociq-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ desktopSidebarCollapsed }) => ({ desktopSidebarCollapsed })
    }
  )
);

