# PostgreSQL Configuration Guide

## ขั้นตอนการตั้งค่า PostgreSQL

### 1. แก้ไขการเชื่อมต่อ PostgreSQL

เปิดไฟล์ `lib/postgres.ts` และอัพเดทข้อมูลการเชื่อมต่อ:

```typescript
const pgConfig = {
  host: 'localhost',        // เปลี่ยนเป็น PostgreSQL host ของคุณ
  port: 5432,               // เปลี่ยนเป็น port ของคุณ
  database: 'commission_db', // เปลี่ยนเป็นชื่อ database ของคุณ
  user: 'postgres',         // เปลี่ยนเป็น username ของคุณ
  password: 'your_password', // เปลี่ยนเป็น password ของคุณ
}
```

### 2. สร้าง Database ใน PostgreSQL

```sql
CREATE DATABASE commission_db;
```

### 3. วิธีใช้งาน

1. กรอกข้อมูล connection ใน `lib/postgres.ts`
2. เปิดหน้า Products (http://localhost:3333/products)
3. กดปุ่ม "Sync to PostgreSQL" 
4. ระบบจะ:
   - ดึงข้อมูลจาก SQL Server (SALESCOMMISSION_Cache)
   - สร้างตารางใน PostgreSQL อัตโนมัติ
   - คัดลอกข้อมูลทั้งหมด

### 4. คุณสมบัติ

- ✅ สร้างตารางอัตโนมัติตาม schema จาก SQL Server
- ✅ Map data types จาก SQL Server เป็น PostgreSQL
- ✅ Sync ข้อมูลด้วยการกดปุ่มเดียว
- ✅ แสดงผลลัพธ์ด้วย Toast notification
- ✅ Loading indicator ขณะ sync

### 5. API Endpoint

- `POST /api/sync-to-postgres` - Sync ข้อมูลจาก SQL Server ไป PostgreSQL
- `GET /api/sync-to-postgres` - ดูข้อมูล API
