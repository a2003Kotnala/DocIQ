"use client";

import { useEffect } from "react";
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
    <Card className="relative min-h-[760px] overflow-hidden bg-[#0d1019] p-4">
      <div className="rounded-2xl bg-white p-4">
        {pdfUrl ? (
          <PdfDocument file={pdfUrl}>
            <PdfPage pageNumber={currentPage} width={760} />
          </PdfDocument>
        ) : (
          <div className="flex h-[680px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
            Document canvas placeholder. Processed page images or PDFs render here.
          </div>
        )}
      </div>
      {highlightedBbox ? (
        <div className="pointer-events-none absolute left-[14%] top-[18%] h-16 w-48 rounded-md border-2 border-warning bg-warning/10" />
      ) : null}
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span>Page {currentPage}{pageCount ? ` / ${pageCount}` : ""}</span>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>Previous</button>
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      </div>
    </Card>
  );
}

