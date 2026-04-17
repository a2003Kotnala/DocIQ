"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, ScanSearch } from "lucide-react";
import { pdfjs, Document as PdfDocument, Page as PdfPage } from "react-pdf";

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
  const highlightedBbox = useDocumentViewerStore((state) => state.highlightedBbox);
  const setCurrentPage = useDocumentViewerStore((state) => state.setCurrentPage);

  useEffect(() => {
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, setCurrentPage]);

  return (
    <Card className="min-h-[820px] p-5">
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="metric-kicker">Evidence viewer</div>
            <div className="mt-2 text-lg font-semibold text-foreground">Source document with review-linked highlighting.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-muted">
            Page {currentPage}
            {pageCount ? ` / ${pageCount}` : ""}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_24%),linear-gradient(180deg,#0b1721_0%,#09111a_100%)] p-5">
          <div className="rounded-[24px] bg-white p-4 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
            {pdfUrl ? (
              <PdfDocument file={pdfUrl}>
                <PdfPage pageNumber={currentPage} width={760} />
              </PdfDocument>
            ) : (
              <div className="flex h-[700px] flex-col items-center justify-center rounded-[20px] border border-slate-200 bg-white text-center text-slate-500">
                <ScanSearch className="h-8 w-8 text-slate-400" />
                <div className="mt-4 text-base font-medium text-slate-700">Document canvas placeholder</div>
                <p className="mt-2 max-w-md text-sm leading-6">
                  Processed page images or PDFs render here, with traceable overlays for extracted field evidence and human review.
                </p>
              </div>
            )}
          </div>

          {highlightedBbox ? (
            <div className="pointer-events-none absolute left-[14%] top-[18%] h-16 w-48 rounded-xl border-2 border-amber-400 bg-amber-400/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.02)]" />
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted">Traceability overlay, bounding box focus, and page navigation stay available during review.</div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground transition hover:border-white/20 hover:bg-white/[0.06]"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground transition hover:border-white/20 hover:bg-white/[0.06]"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
