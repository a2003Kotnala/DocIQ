"use client";

import { useMutation } from "@tanstack/react-query";

import { askQuestion } from "@/api/search";
import { useAuthStore } from "@/stores/authStore";

export function useStreamingChat() {
  const token = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: (question: string) =>
      askQuestion(token ?? "", {
        question,
        filters: {}
      })
  });
}

