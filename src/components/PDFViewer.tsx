/**
 * PDFViewer Component
 * 
 * แสดงผล PDF แบบหลายหน้า ใช้ react-pdf (wrapper ของ pdf.js)
 * 
 * Features:
 * - แสดงทุกหน้าแบบ scrollable
 * - Page navigation (prev/next + page number indicator)
 * - Responsive width (ปรับตาม container)
 * - Loading skeleton ขณะโหลดแต่ละหน้า
 * - Zoom controls (+/-/reset)
 * - รองรับมือถือ (touch scroll)
 * 
 * หมายเหตุ: Component นี้ต้องใช้ dynamic import ด้วย ssr: false
 * เพราะ react-pdf ต้องการ browser APIs (Canvas, Web Workers)
 * 
 * git commit: "feat: add PDFViewer component with multi-page scroll, zoom, and page navigation"
 */
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './PDFViewer.module.css';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PDFViewerProps {
  /** PDF file data as base64 data URL or URL string */
  fileData: string;
  /** Document name for display */
  documentName?: string;
}

export default function PDFViewer({ fileData, documentName }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);

  // Measure container width for responsive PDF rendering
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Track current visible page on scroll
  useEffect(() => {
    const pagesEl = pagesRef.current;
    if (!pagesEl || numPages === 0) return;

    const handleScroll = () => {
      const children = pagesEl.children;
      let closestPage = 1;
      let closestDistance = Infinity;
      const containerTop = pagesEl.scrollTop + pagesEl.clientHeight / 3;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const distance = Math.abs(child.offsetTop - containerTop);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPage = i + 1;
        }
      }
      setCurrentPage(closestPage);
    };

    pagesEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => pagesEl.removeEventListener('scroll', handleScroll);
  }, [numPages]);

  /** PDF loaded successfully */
  const onDocumentLoadSuccess = useCallback(({ numPages: total }: { numPages: number }) => {
    setNumPages(total);
    setIsLoading(false);
    setLoadError(null);
  }, []);

  /** PDF load error */
  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error);
    setLoadError('Failed to load PDF document.');
    setIsLoading(false);
  }, []);

  /** Scroll to specific page */
  const scrollToPage = (pageNum: number) => {
    const pagesEl = pagesRef.current;
    if (!pagesEl) return;
    const pageEl = pagesEl.children[pageNum - 1] as HTMLElement;
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /** Navigate to previous page */
  const goToPrevPage = () => {
    if (currentPage > 1) {
      scrollToPage(currentPage - 1);
    }
  };

  /** Navigate to next page */
  const goToNextPage = () => {
    if (currentPage < numPages) {
      scrollToPage(currentPage + 1);
    }
  };

  /** Zoom controls */
  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const resetZoom = () => setScale(1);

  // Calculate page width based on container
  const pageWidth = containerWidth > 0 ? Math.min(containerWidth - 32, 800) * scale : undefined;

  return (
    <div className={styles.viewer} ref={containerRef}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {documentName && (
            <span className={styles.docName}>{documentName}</span>
          )}
        </div>

        <div className={styles.toolbarCenter}>
          {/* Page Navigation */}
          <button
            className={styles.navButton}
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className={styles.pageInfo}>
            {currentPage} / {numPages || '—'}
          </span>

          <button
            className={styles.navButton}
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            aria-label="Next page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className={styles.toolbarRight}>
          {/* Zoom Controls */}
          <button className={styles.zoomButton} onClick={zoomOut} aria-label="Zoom out" disabled={scale <= 0.5}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button className={styles.zoomReset} onClick={resetZoom} aria-label="Reset zoom">
            {Math.round(scale * 100)}%
          </button>

          <button className={styles.zoomButton} onClick={zoomIn} aria-label="Zoom in" disabled={scale >= 3}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className={styles.pagesContainer} ref={pagesRef}>
        {loadError ? (
          <div className={styles.errorState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>{loadError}</p>
          </div>
        ) : (
          <Document
            file={fileData}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p>Loading document...</p>
              </div>
            }
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div key={`page_wrapper_${index + 1}`} className={styles.pageWrapper}>
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  loading={
                    <div className={styles.pageSkeleton} style={{ width: pageWidth, height: pageWidth ? pageWidth * 1.414 : 400 }}>
                      <div className={styles.skeletonPulse} />
                    </div>
                  }
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
                <span className={styles.pageNumber}>Page {index + 1}</span>
              </div>
            ))}
          </Document>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {numPages > 0 && (
        <div className={styles.mobileNav}>
          <button
            className={styles.mobileNavButton}
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
          >
            ← Prev
          </button>
          <span className={styles.mobilePageInfo}>
            {currentPage} of {numPages}
          </span>
          <button
            className={styles.mobileNavButton}
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
