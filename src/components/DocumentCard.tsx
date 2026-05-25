/**
 * DocumentCard Component
 * 
 * การ์ดแสดงข้อมูลเอกสาร PDF แต่ละรายการ
 * 
 * Features:
 * - แสดง PDF icon, ชื่อเอกสาร, วันที่อัปโหลด, ขนาดไฟล์
 * - แก้ไขชื่อเอกสารได้ (inline editing)
 * - ปุ่ม Open เพื่อเปิดดู PDF
 * - เมนู 3 จุด (more menu) สำหรับ rename/delete
 * - Hover animation
 * 
 * git commit: "feat: add DocumentCard component with inline rename and action menu"
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PDFDocument } from '@/types/document';
import { useDocuments } from '@/context/DocumentContext';
import styles from './DocumentCard.module.css';

interface DocumentCardProps {
  doc: PDFDocument;
  index: number;
}

/**
 * Format bytes to human readable string (e.g., "2.4 MB")
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Format date to relative time string (e.g., "2 hours ago")
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DocumentCard({ doc, index }: DocumentCardProps) {
  const router = useRouter();
  const { renameDocument, deleteDocument } = useDocuments();
  
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(doc.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      window.document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Focus input when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  /** Start editing document name */
  const handleStartEdit = () => {
    setEditName(doc.name);
    setIsEditing(true);
    setShowMenu(false);
  };

  /** Save edited name */
  const handleSaveEdit = () => {
    if (editName.trim() && editName.trim() !== doc.name) {
      renameDocument(doc.id, editName.trim());
    }
    setIsEditing(false);
  };

  /** Handle keyboard events in edit mode */
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditName(doc.name);
      setIsEditing(false);
    }
  };

  /** Navigate to PDF viewer */
  const handleOpen = () => {
    router.push(`/viewer/${doc.id}`);
  };

  /** Delete with confirmation */
  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    deleteDocument(doc.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* PDF Icon */}
      <div className={styles.iconWrapper}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="24" height="28" rx="3" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
          <rect x="8" y="6" width="10" height="2" rx="1" fill="#A5B4FC" />
          <rect x="8" y="10" width="16" height="2" rx="1" fill="#C7D2FE" />
          <rect x="8" y="14" width="16" height="2" rx="1" fill="#C7D2FE" />
          <rect x="8" y="18" width="12" height="2" rx="1" fill="#C7D2FE" />
          <rect x="16" y="22" width="10" height="6" rx="1.5" fill="#EF4444" />
          <text x="21" y="27" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="Inter, sans-serif">PDF</text>
        </svg>
      </div>

      {/* Document Info */}
      <div className={styles.info}>
        {/* Document Name (editable) */}
        {isEditing ? (
          <input
            ref={inputRef}
            className={styles.editInput}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleEditKeyDown}
            maxLength={100}
            aria-label="Edit document name"
          />
        ) : (
          <h3 className={styles.name} title={doc.name}>
            {doc.name}.pdf
          </h3>
        )}

        {/* Meta info */}
        <p className={styles.meta}>
          Uploaded {formatRelativeDate(doc.uploadDate)} • {formatFileSize(doc.fileSize)}
        </p>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {/* More menu button */}
        <div className={styles.menuContainer} ref={menuRef}>
          <button
            className={styles.menuButton}
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Document options"
            id={`menu-btn-${doc.id}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="6" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="18" r="1.5" fill="currentColor" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleStartEdit}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.232 5.232l3.536 3.536M9 11l-6 6v3h3l6-6m-3-3l8.768-8.768a2.5 2.5 0 013.536 3.536L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Rename
              </button>
              <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={handleDelete}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Open Button */}
        <button
          className={styles.openButton}
          onClick={handleOpen}
          id={`open-btn-${doc.id}`}
        >
          Open
        </button>
      </div>

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className={styles.deleteOverlay}>
          <p>Delete this document?</p>
          <div className={styles.deleteActions}>
            <button className={styles.cancelBtn} onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </button>
            <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
