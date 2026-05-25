/**
 * PDF Viewer Page
 * 
 * หน้าแสดงผล PDF เมื่อผู้ใช้คลิก "Open" จาก Dashboard
 * 
 * Features:
 * - Back button กลับ Dashboard
 * - แสดงชื่อเอกสาร (editable inline)
 * - PDFViewer component (dynamic import, ssr: false)
 * - รองรับ mock data (หากไม่มี fileData จะใช้ sample PDF)
 * 
 * git commit: "feat: implement PDF Viewer page with dynamic import, back navigation, and inline rename"
 */
'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useDocuments } from '@/context/DocumentContext';
import styles from './page.module.css';

// Dynamic import PDFViewer (ssr: false เพราะ react-pdf ต้องการ browser APIs)
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <p>Loading viewer...</p>
    </div>
  ),
});

interface ViewerPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getDocument, renameDocument } = useDocuments();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [pdfData, setPdfData] = useState<string | null>(null);

  const doc = getDocument(id);

  // Set up edit name when doc loads
  useEffect(() => {
    if (doc) {
      setEditName(doc.name);
    }
  }, [doc]);

  // Load PDF data (from mock data or sample file)
  useEffect(() => {
    if (doc) {
      if (doc.fileData) {
        setPdfData(doc.fileData);
      } else {
        // For mock documents without fileData, use sample PDF
        setPdfData('/sample.pdf');
      }
    }
  }, [doc]);

  /** Start editing */
  const handleStartEdit = useCallback(() => {
    if (doc) {
      setEditName(doc.name);
      setIsEditing(true);
    }
  }, [doc]);

  /** Save edit */
  const handleSaveEdit = useCallback(() => {
    if (doc && editName.trim() && editName.trim() !== doc.name) {
      renameDocument(doc.id, editName.trim());
    }
    setIsEditing(false);
  }, [doc, editName, renameDocument]);

  /** Handle keyboard in edit mode */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      if (doc) setEditName(doc.name);
      setIsEditing(false);
    }
  };

  // Document not found
  if (!doc) {
    return (
      <div className={styles.notFound}>
        <h2>Document Not Found</h2>
        <p>The document you&apos;re looking for doesn&apos;t exist.</p>
        <button className={styles.backButton} onClick={() => router.push('/')}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.viewerPage}>
      {/* Top Bar */}
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push('/')}
          aria-label="Back to Dashboard"
          id="back-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.backText}>Back</span>
        </button>

        {/* Document Title (editable) */}
        <div className={styles.titleArea}>
          {isEditing ? (
            <input
              className={styles.titleInput}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              autoFocus
              maxLength={100}
              aria-label="Edit document name"
            />
          ) : (
            <button className={styles.titleButton} onClick={handleStartEdit} title="Click to rename">
              <span className={styles.titleText}>{doc.name}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.232 5.232l3.536 3.536M9 11l-6 6v3h3l6-6m-3-3l8.768-8.768a2.5 2.5 0 013.536 3.536L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Page count badge */}
        <span className={styles.pageBadge}>{doc.pageCount} pages</span>
      </header>

      {/* PDF Viewer */}
      <div className={styles.viewerContainer}>
        {pdfData ? (
          <PDFViewer fileData={pdfData} documentName={doc.name} />
        ) : (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>Preparing document...</p>
          </div>
        )}
      </div>
    </div>
  );
}
