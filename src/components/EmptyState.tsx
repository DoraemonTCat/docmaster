/**
 * แสดงเมื่อยังไม่มีเอกสาร หรือค้นหาไม่เจอ
 * มี illustration + ข้อความ + ปุ่ม CTA upload
 */
'use client';

import styles from './EmptyState.module.css';

interface EmptyStateProps {
  type: 'no-documents' | 'no-results';
  searchQuery?: string;
  onUpload?: () => void;
}

export default function EmptyState({ type, searchQuery, onUpload }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      {/* Illustration */}
      <div className={styles.illustration}>
        {type === 'no-documents' ? (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="10" width="70" height="90" rx="8" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2" />
            <rect x="35" y="25" width="30" height="4" rx="2" fill="#A5B4FC" />
            <rect x="35" y="35" width="50" height="3" rx="1.5" fill="#E0E7FF" />
            <rect x="35" y="43" width="50" height="3" rx="1.5" fill="#E0E7FF" />
            <rect x="35" y="51" width="40" height="3" rx="1.5" fill="#E0E7FF" />
            <circle cx="85" cy="85" r="22" fill="white" stroke="#C7D2FE" strokeWidth="2" />
            <path d="M78 85l4 4 8-8" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M60 75l-5 5" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="55" cy="50" r="25" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2" />
            <path d="M73 68l20 20" stroke="#A5B4FC" strokeWidth="4" strokeLinecap="round" />
            <path d="M48 45l14 10M62 45L48 55" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Text */}
      <h3 className={styles.title}>
        {type === 'no-documents' ? 'No documents yet' : 'No results found'}
      </h3>
      <p className={styles.description}>
        {type === 'no-documents'
          ? 'Upload your first PDF document to get started.'
          : `No documents match "${searchQuery}". Try a different search term.`}
      </p>

      {/* CTA Button */}
      {type === 'no-documents' && onUpload && (
        <button className={styles.ctaButton} onClick={onUpload}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Upload PDF
        </button>
      )}
    </div>
  );
}
