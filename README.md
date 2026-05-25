# DocMaster - Next.js PDF Upload & Viewer (Take-Home Assignment)

**DocMaster** เป็นเว็บแอปพลิเคชันต้นแบบ (Prototype Web Application) สำหรับจัดการและแสดงผลเอกสาร PDF พัฒนาด้วย **Next.js (App Router)** และ **TypeScript** ภายใต้แนวคิดการออกแบบ **Mobile-First UX** รองรับการทำงานแบบสัญบูรณ์ทั้งบนมือถือและเดสก์ท็อป โดยใช้ **React Context + useReducer** ในการจำลองฐานข้อมูล (Mock Data Store) สำหรับจัดการข้อมูลแบบ CRUD ทั้งหมด

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

โปรดทำตามขั้นตอนต่อไปนี้เพื่อติดตั้งและทดสอบโปรเจกต์ทันที:

### 1. เข้าไปยังโฟลเดอร์ของโปรเจกต์
เปิด Terminal และไปยังโฟลเดอร์ `docmaster`:
```bash
cd docmaster
```

### 2. ติดตั้ง Dependencies
ติดตั้งแพ็กเกจที่จำเป็นทั้งหมดผ่าน npm:
```bash
npm install
```

### 3. รันโปรเจกต์ในโหมดพัฒนา (Development Server)
เริ่มการรันโปรเจกต์บนเครื่องของคุณ:
```bash
npm run dev
```

### 4. เปิดดูผ่านเบราว์เซอร์
เมื่อโปรเจกต์เริ่มทำงานแล้ว สามารถเปิดดูผลลัพธ์ผ่านลิงก์ด้านล่างนี้:
🌐 [http://localhost:3000](http://localhost:3000)

---

## 📊 สรุปความต้องการและสิ่งที่พัฒนาเสร็จสิ้นแล้ว (Functional Requirements Checklist)

โปรเจกต์นี้ได้รับการพัฒนาเสร็จสิ้น **ครบถ้วนตามทุกหัวข้อความต้องการของโจทย์ (100% Fully Compliant)** โดยมีรายละเอียดดังนี้:

| หัวข้อความต้องการ (Functional Requirements) | สถานะ | ไฟล์/ส่วนสำคัญในโค้ด | คำอธิบายเพิ่มเติม |
| :--- | :---: | :--- | :--- |
| **1. หน้า Dashboard แสดงรายการเอกสาร** | ✅ เสร็จสิ้น | `src/app/page.tsx` | หน้าหลักที่รวมทุกอย่างเข้าด้วยกันอย่างลงตัว แสดงรายการไฟล์ PDF จำลองและที่อัปโหลดเพิ่ม |
| **2. อัปโหลดไฟล์ PDF แบบลากวาง** | ✅ เสร็จสิ้น | `src/components/UploadModal.tsx` | รองรับ Drag & Drop หรือ Browse เพื่ออัปโหลดไฟล์ได้อย่างสะดวก |
| **3. หน้า PDF Viewer สำหรับแสดงเอกสาร** | ✅ เสร็จสิ้น | `src/app/viewer/[id]/page.tsx` | หน้าแสดงตัวเอกสารแบบเต็มจอ พร้อมเมนูควบคุมการแสดงผลที่หลากหลาย |
| **4. ออกแบบ UX แบบ Mobile-First** | ✅ เสร็จสิ้น | `src/app/page.module.css`<br>`src/components/*.module.css` | ออกแบบส่วนนำทาง แถบเมนูด้านล่าง (Bottom Nav) และปุ่มกดให้ใช้งานบนมือถือได้สะดวกที่สุด |
| **5. รองรับ Desktop (Optional)** | ✅ เสร็จสิ้น | `src/app/globals.css` | แสดงผลในรูปแบบ Grid Layout และปรับขนาดแถบเมนูให้สมดุลสวยงามเมื่อเปิดบนหน้าจอคอมพิวเตอร์ |
| **6. แสดงชื่อเอกสารได้** | ✅ เสร็จสิ้น | `src/components/DocumentCard.tsx` | แสดงชื่อเอกสาร รายละเอียดขนาด วันที่ และจำนวนหน้าในรูปแบบการ์ดที่สวยงาม |
| **7. แก้ไขชื่อเอกสารได้** | ✅ เสร็จสิ้น | `src/app/viewer/[id]/page.tsx`<br>`src/context/DocumentContext.tsx` | แก้ไขชื่อได้ทันทีจากเมนูบนการ์ด หรือคลิกเปลี่ยนชื่อแบบ **Inline Rename** ในหน้าเปิดอ่าน PDF |
| **8. แสดงวันที่อัปโหลด** | ✅ เสร็จสิ้น | `src/components/DocumentCard.tsx` | แสดงเวลาที่อัปโหลดจริง (Relative Time หรือวันที่อัปโหลด) |
| **9. รองรับเฉพาะ PDF และจำกัดขนาด** | ✅ เสร็จสิ้น | `src/context/DocumentContext.tsx` | ตรวจสอบไฟล์อัปโหลดอย่างปลอดภัย (เฉพาะ `application/pdf` และขนาดไม่เกิน **10MB**) |
| **10. แสดงผล PDF ได้หลายหน้าบนมือถือ** | ✅ เสร็จสิ้น | `src/components/PDFViewer.tsx` | แสดงผลเอกสารแบบทีละหลายหน้าพร้อมกันแบบต่อเนื่อง (Scrollable), ซูมเข้า-ออก (Zoom), และแสดงหน้าปัจจุบัน |

---

## 🛠️ เทคโนโลยีและแพ็กเกจที่เลือกใช้ (Tech Stack)

* **Framework**: [Next.js v15 (App Router)](https://nextjs.org/) + React 19
* **Language**: [TypeScript](https://www.typescript.org/) — เพื่อความปลอดภัยในการเขียนโค้ดและมี Type-safety ที่แข็งแกร่ง
* **Styling**: [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules) — เพื่อสไตล์ที่แยกส่วนกันอย่างชัดเจนและไม่เกิดปัญหา Class Name ชนกัน
* **PDF Rendering Engine**: [react-pdf](https://projects.wojtekmaj.pl/react-pdf/) + [pdfjs-dist](https://github.com/mozilla/pdf.js) — ใช้สำหรับการแสดงผลหน้าเอกสาร PDF เสมือนจริงบนหน้าเบราว์เซอร์อย่างมีประสิทธิภาพ

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

โปรเจกต์ได้รับการออกแบบโครงสร้างแบบแยกส่วน (Modular Structure) เพื่อให้ง่ายต่อการบำรุงรักษาและการขยายระบบในอนาคต:

```text
docmaster/
├── public/                 # เก็บไฟล์ Static เช่น รูปไอคอน และไฟล์ตัวอย่าง PDF
│   └── sample.pdf          # ไฟล์ตัวอย่างสำหรับการเปิดทดสอบเอกสารจำลอง
├── src/
│   ├── app/                # โครงสร้างหน้าของ Next.js (App Router)
│   │   ├── layout.tsx      # Layout หลักของแอปพลิเคชัน (โอบรับด้วย Provider)
│   │   ├── page.tsx        # Dashboard (หน้าแสดงเอกสารทั้งหมด, ค้นหา, และฟิลเตอร์)
│   │   └── viewer/[id]/    # หน้าสำหรับแสดงตัวอ่านเอกสาร PDF ตาม ID
│   │       └── page.tsx
│   ├── components/         # คอมโพเนนต์ UI ทั้งหมด (Reusable Components)
│   │   ├── DocumentCard.tsx # การ์ดแสดงผลข้อมูลเอกสาร
│   │   ├── EmptyState.tsx   # หน้าต้อนรับ/แจ้งเตือนกรณีไม่มีข้อมูลเอกสาร
│   │   ├── Header.tsx       # แถบหัวเว็บด้านบน
│   │   ├── PDFViewer.tsx    # คอมโพเนนต์เปิดอ่าน PDF ควบคุมการย่อขยายและจำนวนหน้า
│   │   ├── SearchBar.tsx    # กล่องค้นหาข้อมูลแบบ Real-time
│   │   └── UploadModal.tsx  # ป๊อปอัปสำหรับเลือกและลากวางอัปโหลดไฟล์ PDF
│   ├── context/            # ระบบจัดการ State ของแอปพลิเคชัน
│   │   └── DocumentContext.tsx # เก็บข้อมูลแบบ In-memory (CRUD) และระบบจัดการไฟล์
│   └── types/              # นิยามชนิดข้อมูล (Type Definitions)
│       └── document.ts      # กำหนด Schema ของเอกสาร PDF ในแอป
├── package.json            # ไฟล์ระบุ Dependencies และสคริปต์สำหรับการรัน
└── tsconfig.json           # การตั้งค่า TypeScript
```

---

## 🧠 การตัดสินใจเชิงสถาปัตยกรรมและสไตล์ดีไซน์ (Key Architectural Decisions)

1. **In-Memory Data Store (React Context & useReducer)**
   * แทนที่จะสร้างตัวแปรใน Component ทั่วไป เราเลือกใช้ **React Context** เพื่อจำลองพฤติกรรมของฐานข้อมูล (Database Simulator) ทำให้ทุกหน้ารวมถึงหน้า Viewer สามารถดึงและอัปเดตสถานะของเอกสารเดียวกันได้ทันที ช่วยปูทางให้การเชื่อมต่อ API ไปยัง Database จริงในอนาคตทำได้ง่ายเพียงแค่เปลี่ยนโค้ดในจุดเดียว

2. **ประสิทธิภาพในการโหลดไฟล์ (Dynamic Import & No-SSR)**
   * เนื่องจากไลบรารีแสดงผล PDF (`react-pdf`) จำเป็นต้องทำงานบน Browser APIs เท่านั้น ในหน้า Viewer จึงใช้ **Dynamic Import** ร่วมกับตัวเลือก `ssr: false` เพื่อให้แน่ใจว่าหน้าเว็บจะไม่เกิดข้อผิดพลาดในการ Render ฝั่ง Server และยังช่วยลดภาระการดาวน์โหลด JavaScript ที่ยังไม่จำเป็น (Code Splitting)

3. **ระบบ Drag-and-Drop & File Validation**
   * ระบบอัปโหลดใน `UploadModal` มีการตรวจสอบ MIME Type และขีดจำกัดขนาดไฟล์ก่อนทำการประมวลผล เพื่อป้องกันข้อผิดพลาด และแปลงเนื้อหาเป็น **Base64 Data URL** ในโหมด Mock ทำให้ระบบยังคงเปิดอ่านเอกสารนั้น ๆ ได้ผ่าน state ท้องถิ่นโดยไม่ต้องมี Server จริงมารับไฟล์

4. **UX ดีเยี่ยมด้วยความสวยงามระดับพรีเมียม (Premium UX/UI Design)**
   * นำแนวคิด **Glassmorphism**, แอนิเมชันแบบไล่สี (Gradient Animations), และการแสดงผล **Loading Skeleton** ในขณะดาวน์โหลดไฟล์หรือเปลี่ยนหน้า ทำให้ผู้ใช้รู้สึกว่าระบบทำงานรวดเร็วและเป็นมืออาชีพ

---


