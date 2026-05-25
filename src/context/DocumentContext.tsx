/**
 * Features:
 * - เพิ่มเอกสาร (upload)
 * - แก้ไขชื่อเอกสาร
 * - ลบเอกสาร
 * - ค้นหาเอกสาร
 */
'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { PDFDocument, DocumentAction } from '@/types/document';

/* ============================================
   Mock Initial Data
   ============================================ */

// Helper to generate unique IDs
const generateId = (): string => {
  return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Initial mock documents (will use sample PDF from public folder)
const INITIAL_DOCUMENTS: PDFDocument[] = [
  {
    id: 'doc_mock_001',
    name: 'Q4 Financial Report',
    originalName: 'Q4_Financial_Report.pdf',
    uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    fileSize: 2516582, // ~2.4 MB
    pageCount: 12,
    fileData: '', // Will be loaded from public/sample.pdf
  },
  {
    id: 'doc_mock_002',
    name: 'Employee Handbook 2024',
    originalName: 'Employee_Handbook_2024.pdf',
    uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    fileSize: 8493465, // ~8.1 MB
    pageCount: 45,
    fileData: '',
  },
  {
    id: 'doc_mock_003',
    name: 'Project Alpha Specs Draft',
    originalName: 'Project_Alpha_Specs_Draft.pdf',
    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    fileSize: 1153434, // ~1.1 MB
    pageCount: 8,
    fileData: '',
  },
];

/* ============================================
   Reducer
   ============================================ */
function documentReducer(state: PDFDocument[], action: DocumentAction): PDFDocument[] {
  switch (action.type) {
    case 'ADD_DOCUMENT':
      return [action.payload, ...state];

    case 'RENAME_DOCUMENT':
      return state.map((doc) =>
        doc.id === action.payload.id
          ? { ...doc, name: action.payload.name }
          : doc
      );

    case 'DELETE_DOCUMENT':
      return state.filter((doc) => doc.id !== action.payload.id);

    default:
      return state;
  }
}

/* ============================================
   Context Types
   ============================================ */
interface DocumentContextType {
  documents: PDFDocument[];
  addDocument: (file: File) => Promise<void>;
  renameDocument: (id: string, newName: string) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => PDFDocument | undefined;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

/* ============================================
   File Size Limit
   ============================================ */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_FILE_TYPE = 'application/pdf';

/* ============================================
   Provider Component
   ============================================ */
interface DocumentProviderProps {
  children: ReactNode;
}

export function DocumentProvider({ children }: DocumentProviderProps) {
  const [documents, dispatch] = useReducer(documentReducer, INITIAL_DOCUMENTS);

  /**
   * Upload a new PDF document
   * Validates file type and size, reads content, and extracts page count
   */
  const addDocument = useCallback(async (file: File): Promise<void> => {
    // Validate file type
    if (file.type !== ALLOWED_FILE_TYPE) {
      throw new Error('Only PDF files are allowed.');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
    }

    // Read file as base64
    const fileData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });

    // Get page count using a temporary canvas
    let pageCount = 1;
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();
      const pdf = await pdfjsLib.getDocument(fileData).promise;
      pageCount = pdf.numPages;
    } catch {
      // If page count extraction fails, default to 1
      console.warn('Could not extract page count, defaulting to 1');
    }

    // Create document entry
    const newDocument: PDFDocument = {
      id: generateId(),
      name: file.name.replace(/\.pdf$/i, ''),
      originalName: file.name,
      uploadDate: new Date(),
      fileSize: file.size,
      pageCount,
      fileData,
    };

    dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
  }, []);

  /**
   * Rename a document
   */
  const renameDocument = useCallback((id: string, newName: string): void => {
    if (!newName.trim()) return;
    dispatch({ type: 'RENAME_DOCUMENT', payload: { id, name: newName.trim() } });
  }, []);

  /**
   * Delete a document
   */
  const deleteDocument = useCallback((id: string): void => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: { id } });
  }, []);

  /**
   * Get a single document by ID
   */
  const getDocument = useCallback(
    (id: string): PDFDocument | undefined => {
      return documents.find((doc) => doc.id === id);
    },
    [documents]
  );

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        renameDocument,
        deleteDocument,
        getDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

/* ============================================
   Custom Hook
   ============================================ */
export function useDocuments(): DocumentContextType {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
