# คู้มือการใช้งาน Notes Boy Secure Notes
66010810 Sillapachai Homhual

### Step 1 เตรียมความพร้อม
1. ติดตั้ง **Node.js** 
2. Clone จาก GitHub
3. โปรเจกต์นี้แยกเป็น 2 โฟลเดอร์หลัก คือ `frontend` และ `backend` 

### Step 2 Run Backend
1. เปิด Terminal แล้วเข้าไปที่โฟลเดอร์ `backend`
2. พิมพ์คำสั่ง `npm install` แล้วกด Enter (โหลด Node Moduls)
3. สร้างไฟล์ `.env` ไว้ในโฟลเดอร์ `Backend` แล้วใส่โค๊ดดังนี้:
    - PORT=xxxx
    - POCKETBASE_URL=ลิงก์_PocketBase
    - POCKETBASE_TOKEN=โค้ด_Token
4. พิมพ์คำสั้ง `node server.js`  ใน Terminal และกด Enter
เมื่อ Run สำเร็จจะขึ้นข้อความ Backend server running at http://localhost:xxxx

### Step 3 Run Fontend
1. เปิด Terminal แล้วเข้าไปที่โฟลเดอร์ `fontend`
2. พิมพ์คำสั่ง `npm install` แล้วกด Enter (โหลด Node Moduls)
3. สร้างไฟล์ `.env` ไว้ในโฟลเดอร์ `Fontend` แล้วใส่โค๊ดดังนี้
    - VITE_API_URL=http://localhost:xxxx 
4. พิมพ์คำสั้ง `npm run dev` ใน Terminal และกด Enter 
เมื่อ Run สำเร็จจะขึ้นข้อความ http://localhost:xxxx

### เปิดโปรเจคผ่าน Browser ที่ deploy ขึ้น Vercel
https://secure-note-notesboy.vercel.app
1. sign up
2. login
3. สร้าง แก้ไข หรือลบโน๊ตของเราเอง