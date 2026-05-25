/**

 * Modal สำหรับอัปโหลดไฟล์ PDF พร้อม Drag & Drop
 * 
 * Features:
 * - Drag & Drop zone พร้อม visual feedback
 * - File picker button ("Browse Files")
 * - Validation: เฉพาะ .pdf, จำกัดขนาด 10MB
 * - แสดง progress/loading ขณะอัปโหลด
 * - Error messages สำหรับไฟล์ไม่ถูกต้อง
 * - Backdrop click เพื่อปิด modal

 */
'use client';

import { useState, useRef, useCallback } from 'react';
import { useDocuments, MAX_FILE_SIZE, ALLOWED_FILE_TYPE } from '@/context/DocumentContext';
import styles from './UploadModal.module.css';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { addDocument } = useDocuments();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  /** Reset state when modal opens/closes */
  const resetState = useCallback(() => {
    setIsDragging(false);
    setIsUploading(false);
    setError(null);
    setUploadedFileName(null);
  }, []);

  /** Handle file upload */
  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setUploadedFileName(null);

    // Validate file type
    if (file.type !== ALLOWED_FILE_TYPE) {
      setError('Only PDF files (.pdf) are supported.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`);
      return;
    }

    setIsUploading(true);

    try {
      await addDocument(file);
      setUploadedFileName(file.name);
      // Auto-close after short delay for success feedback
      setTimeout(() => {
        resetState();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [addDocument, onClose, resetState]);

  /** Drag events */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  /** File input change */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  /** Click to browse */
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  /** Close modal */
  const handleClose = () => {
    if (isUploading) return; // Don't close while uploading
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close upload modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Title */}
        <h2 className={styles.title}>Upload Document</h2>
        <p className={styles.subtitle}>Drop your PDF file here or browse to upload</p>

        {/* Drop Zone */}
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${uploadedFileName ? styles.success : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isUploading ? (
            /* Uploading State */
            <div className={styles.uploadingState}>
              <div className={styles.spinner} />
              <p className={styles.uploadingText}>Processing document...</p>
            </div>
          ) : uploadedFileName ? (
            /* Success State */
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#22c55e" />
                  <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={styles.successText}>{uploadedFileName}</p>
              <p className={styles.successSubtext}>Uploaded successfully!</p>
            </div>
          ) : (
            /* Default Drop State */
            <>
              <div className={styles.dropIcon}>
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="4" width="32" height="40" rx="4" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2" />
                  <path d="M24 18v12M18 24l6-6 6 6" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={styles.dropText}>
                <strong>Drop your PDF here</strong>
              </p>
              <p className={styles.dropSubtext}>or</p>
              <button className={styles.browseButton} onClick={handleBrowseClick} type="button">
                Browse Files
              </button>
              <p className={styles.fileLimits}>PDF only • Max {MAX_FILE_SIZE / (1024 * 1024)}MB</p>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className={styles.hiddenInput}
          aria-label="Upload PDF file"
          id="file-upload-input"
        />
      </div>
    </div>
  );
}
