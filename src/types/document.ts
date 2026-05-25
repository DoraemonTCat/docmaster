/**
 * TypeScript interfaces สำหรับเอกสาร PDF ในระบบ
 * ออกแบบให้สามารถขยายต่อไปยังระบบจริงได้ง่าย
 * (เช่น เพิ่ม userId, tags, status ในอนาคต)
 */

export interface PDFDocument {
  id: string;
  name: string;
  originalName: string;
  uploadDate: Date;
  fileSize: number;
  pageCount: number;


  fileData: string;
}

/** Actions available for document management */
export type DocumentAction =
  | { type: 'ADD_DOCUMENT'; payload: PDFDocument }
  | { type: 'RENAME_DOCUMENT'; payload: { id: string; name: string } }
  | { type: 'DELETE_DOCUMENT'; payload: { id: string } };
