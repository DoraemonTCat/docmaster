/**
 * Header Component
 * 
 * แถบด้านบนของแอป แสดงชื่อ "DocMaster" และ user avatar
 * ออกแบบ mobile-first: compact บนมือถือ, ขยายบน desktop
 * 
 * git commit: "feat: add Header component with app branding and user avatar"
 */
'use client';

import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo & Brand */}
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#logoGradient)" />
              <path d="M8 8h8M8 12h8M8 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="logoGradient" x1="3" y1="3" x2="21" y2="21">
                  <stop stopColor="#4f46e5" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className={styles.title}>DocMaster</h1>
        </div>

        {/* User Avatar */}
        <button className={styles.avatar} aria-label="User menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
