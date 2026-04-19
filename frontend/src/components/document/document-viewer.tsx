"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, ScanSearch } from "lucide-react";
import { pdfjs, Document as PdfDocument, Page as PdfPage } from "react-pdf";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDocumentViewerStore } from "@/stores/documentViewerStore";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function DocumentViewer({
  pdfUrl,
  pageCount
}: {
  pdfUrl?: string;
  pageCount?: number | null;
}) {
  const currentPage = useDocumentViewerStore((state) => state.currentPage);
  const zoomLevel = useDocumentViewerStore((state) => state.zoomLevel);
  const highlightedBbox = useDocumentViewerStore((state) => state.highlightedBbox);
  const setCurrentPage = useDocumentViewerStore((state) => state.setCurrentPage);
  const setZoomLevel = useDocumentViewerStore((state) => state.setZoomLevel);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState(760);

  useEffect(() => {
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, setCurrentPage]);

  useEffect(() => {
    const node = canvasRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const update = () => {
      const padding = 32;
      const next = Math.max(320, Math.min(860, node.clientWidth - padding));
      setPageWidth(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <Card className="min-h-[820px] p-5">
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="metric-kicker">Evidence viewer</div>
            <div className="mt-2 text-lg font-semibold text-foreground">Source document with review-linked highlighting.</div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-xs text-muted">
              Page {currentPage}
              {pageCount ? ` / ${pageCount}` : ""}
            </div>
            <div className="flex items-center gap-1 rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-1">
              <Button
                aria-label="Zoom out"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl"
                onClick={() => setZoomLevel(Math.max(0.8, Number((zoomLevel - 0.1).toFixed(2))))}
                type="button"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-3)]">
                {Math.round(zoomLevel * 100)}%
              </div>
              <Button
                aria-label="Zoom in"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl"
                onClick={() => setZoomLevel(Math.min(1.6, Number((zoomLevel + 0.1).toFixed(2))))}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-[rgba(220,180,110,0.14)] bg-[radial-gradient(circle_at_top,rgba(200,147,74,0.10),transparent_32%),linear-gradient(180deg,rgba(26,22,18,0.98)_0%,rgba(19,16,9,0.98)_100%)] p-5">
          <div
            ref={canvasRef}
            className="max-h-[720px] overflow-auto rounded-[24px] bg-white p-4 shadow-[0_40px_80px_rgba(0,0,0,0.35)]"
          >
            {pdfUrl ? (
              <PdfDocument file={pdfUrl}>
                <PdfPage pageNumber={currentPage} width={pageWidth} scale={zoomLevel} />
              </PdfDocument>
            ) : (
              <div className="flex h-[700px] flex-col items-center justify-center rounded-[20px] border border-[rgba(90,78,68,0.24)] bg-white text-center text-[rgba(90,78,68,0.8)]">
                <ScanSearch className="h-8 w-8 text-[rgba(90,78,68,0.55)]" />
                <div className="mt-4 text-base font-medium text-[rgba(28,24,20,0.82)]">Document canvas placeholder</div>
                <p className="mt-2 max-w-md text-sm leading-6">
                  Processed page images or PDFs render here, with traceable overlays for extracted field evidence and human review.
                </p>
              </div>
            )}
          </div>

          {highlightedBbox ? (
            <div className="pointer-events-none absolute left-[14%] top-[18%] h-16 w-48 rounded-xl border-2 border-[rgba(224,173,108,0.9)] bg-[rgba(200,147,74,0.12)] shadow-[0_0_0_9999px_rgba(0,0,0,0.02)]" />
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted">Traceability overlay, bounding box focus, and page navigation stay available during review.</div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} type="button">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setCurrentPage(currentPage + 1)} type="button">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
