/**
 * 
 * ช่องค้นหาเอกสารตามชื่อ
 * มี icon ค้นหาและปุ่ม clear
 * 
 */
'use client';

import { useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search documents...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`${styles.wrapper} ${isFocused ? styles.focused : ''}`}>
      {/* Search Icon */}
      <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Input */}
      <input
        id="search-documents"
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        aria-label="Search documents"
      />

      {/* Clear Button */}
      {value && (
        <button
          className={styles.clearButton}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
