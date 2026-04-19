"use client";

import { create } from "zustand";

interface DocumentViewerState {
  documentId: string | null;
  currentPage: number;
  zoomLevel: number;
  selectedFieldId: string | null;
  highlightedBbox: Record<string, unknown> | null;
  paneWidth: number;
  activeTab: "fields" | "validation" | "history" | "workflow";
  setDocumentId: (documentId: string) => void;
  setCurrentPage: (page: number) => void;
  setZoomLevel: (zoomLevel: number) => void;
  selectField: (fieldId: string | null, bbox?: Record<string, unknown> | null) => void;
  setActiveTab: (tab: DocumentViewerState["activeTab"]) => void;
}

export const useDocumentViewerStore = create<DocumentViewerState>((set) => ({
  documentId: null,
  currentPage: 1,
  zoomLevel: 1,
  selectedFieldId: null,
  highlightedBbox: null,
  paneWidth: 0.4,
  activeTab: "fields",
  setDocumentId: (documentId) => set({ documentId }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  selectField: (selectedFieldId, highlightedBbox = null) => set({ selectedFieldId, highlightedBbox }),
  setActiveTab: (activeTab) => set({ activeTab })
}));

