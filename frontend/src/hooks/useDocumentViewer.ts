"use client";

import { useDocumentViewerStore } from "@/stores/documentViewerStore";

export function useDocumentViewer() {
  return useDocumentViewerStore();
}

