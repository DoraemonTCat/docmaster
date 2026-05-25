/**
 * Document Type Definitions
 * 
 * TypeScript interfaces สำหรับเอกสาร PDF ในระบบ
 * ออกแบบให้สามารถขยายต่อไปยังระบบจริงได้ง่าย
 * (เช่น เพิ่ม userId, tags, status ในอนาคต)
 * 
 * git commit: "feat: add TypeScript type definitions for PDF document model"
 */

export interface PDFDocument {
  /** Unique identifier for the document */
  id: string;

  /** Display name of the document (editable by user) */
  name: string;

  /** Original filename from upload */
  originalName: string;

  /** Date when the document was uploaded */
  uploadDate: Date;

  /** File size in bytes */
  fileSize: number;

  /** Total number of pages in the PDF */
  pageCount: number;

  /**
   * PDF file data stored as base64 string
   * In production, this would be a URL to cloud storage
   */
  fileData: string;
}

/** Actions available for document management */
export type DocumentAction =
  | { type: 'ADD_DOCUMENT'; payload: PDFDocument }
  | { type: 'RENAME_DOCUMENT'; payload: { id: string; name: string } }
  | { type: 'DELETE_DOCUMENT'; payload: { id: string } };
