"use client";

import { useMutation } from "@tanstack/react-query";

import { searchDocuments } from "@/api/search";
import { useAuthStore } from "@/stores/authStore";

export function useSearch() {
  const token = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: (query: string) =>
      searchDocuments(token ?? "", {
        query,
        filters: {}
      })
  });
}

