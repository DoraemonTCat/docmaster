/**
 * Dashboard Page (Home)
 * 
 * หน้าหลักแสดงรายการเอกสาร PDF ทั้งหมด
 * 
 * Features:
 * - Greeting section ต้อนรับผู้ใช้ + จำนวนเอกสาร
 * - Upload zone (คลิกเพื่อเปิด UploadModal)
 * - Search bar ค้นหาเอกสาร
 * - Filter tabs (All Files, Recent, etc.)
 * - Document cards list
 * - EmptyState เมื่อยังไม่มีเอกสาร/ค้นหาไม่เจอ
 * - Bottom navigation (mobile)
 * 
 * git commit: "feat: implement Dashboard page with document list, search, upload zone, and bottom nav"
 */
'use client';

import { useState, useMemo } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import DocumentCard from '@/components/DocumentCard';
import UploadModal from '@/components/UploadModal';
import EmptyState from '@/components/EmptyState';
import styles from './page.module.css';

/** Filter tabs */
const FILTER_TABS = ['All Files', 'Recent', 'Oldest'];

export default function DashboardPage() {
  const { documents } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Files');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  /** Filter and sort documents */
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.originalName.toLowerCase().includes(query)
      );
    }

    // Sort based on active filter
    switch (activeFilter) {
      case 'Recent':
        return [...filtered].sort(
          (a, b) => b.uploadDate.getTime() - a.uploadDate.getTime()
        );
      case 'Oldest':
        return [...filtered].sort(
          (a, b) => a.uploadDate.getTime() - b.uploadDate.getTime()
        );
      default:
        return filtered;
    }
  }, [documents, searchQuery, activeFilter]);

  /** Get greeting based on time of day */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Greeting Section */}
          <section className={styles.greeting}>
            <h2 className={styles.greetingTitle}>{getGreeting()}, User</h2>
            <p className={styles.greetingSubtitle}>
              You have <span className={styles.docCount}>{documents.length} document{documents.length !== 1 ? 's' : ''}</span> uploaded.
            </p>
          </section>

          {/* Upload Drop Zone Card */}
          <section
            className={styles.uploadCard}
            onClick={() => setIsUploadModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsUploadModalOpen(true)}
            id="upload-zone"
          >
            <div className={styles.uploadCardIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="4" width="32" height="40" rx="4" fill="#E0E7FF" stroke="#A5B4FC" strokeWidth="1.5" />
                <path d="M24 18v12M18 24l6-6 6 6" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className={styles.uploadCardTitle}>Drop your PDFs here</p>
              <p className={styles.uploadCardSubtitle}>
                Drag and drop your documents to instantly upload, analyze, and store securely.
              </p>
            </div>
            <button className={styles.uploadCardButton} type="button">
              Browse Files
            </button>
          </section>

          {/* Search & Filter */}
          <section className={styles.searchSection}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search documents..."
            />
            <div className={styles.filterTabs}>
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`${styles.filterTab} ${activeFilter === tab ? styles.active : ''}`}
                  onClick={() => setActiveFilter(tab)}
                  id={`filter-${tab.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          {/* Document List */}
          {filteredDocuments.length > 0 ? (
            <section className={styles.documentList}>
              {filteredDocuments.map((doc, index) => (
                <DocumentCard key={doc.id} doc={doc} index={index} />
              ))}
            </section>
          ) : documents.length === 0 ? (
            <EmptyState
              type="no-documents"
              onUpload={() => setIsUploadModalOpen(true)}
            />
          ) : (
            <EmptyState type="no-results" searchQuery={searchQuery} />
          )}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className={styles.bottomNav}>
        <button className={`${styles.navItem} ${styles.active}`} id="nav-dashboard">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
            <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" />
            <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" />
            <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
          </svg>
          Dashboard
        </button>
        <button
          className={styles.navItemUpload}
          onClick={() => setIsUploadModalOpen(true)}
          id="nav-upload"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Upload
        </button>
        <button className={styles.navItem} id="nav-settings">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Settings
        </button>
      </nav>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
}
