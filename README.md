# 🏥 Hospital Security Awareness & EMR Phishing Simulation Platform

Platform simulasi dan edukasi keamanan informasi internal rumah sakit berbasis **Next.js 15**, **Prisma**, **Supabase PostgreSQL**, dan **Nodemailer SMTP**.

---

## 🌟 Fitur Utama
1. **Simulasi EMR RSMAD**:
   - Alur 2 Langkah identik dengan sistem Rekam Medis Elektronik rumah sakit.
   - Pengiriman kode OTP asli ke inbox email via Gmail SMTP.
   - Dashboard tindak lanjut dan peringatan kesadaran keamanan informasi.
2. **Dashboard Superadmin**:
   - Ringkasan statistik & metrik kesadaran staf.
   - Manajemen Akun Users (CRUD lengkap dengan Supabase PostgreSQL).
   - Log Jejak Aktivitas (*Realtime Activity Logs*).

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers)
- **Database & ORM**: Supabase PostgreSQL & Prisma ORM
- **Email Service**: Nodemailer (Gmail App Password SMTP)
- **Styling**: Tailwind CSS & Lucide React Icons

---

## 🚀 Cara Menjalankan Project

1. **Clone Repository**:
   ```bash
   git clone https://github.com/chilmi89/phising-awareness.git
   cd phising-awareness
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` menjadi `.env` lalu sesuaikan kredensial Supabase dan SMTP Gmail:
   ```bash
   cp .env.example .env
   ```

4. **Jalankan Database Migration & Seed**:
   ```bash
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

5. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda.

---

## 🔐 Kredensial Superadmin
- **URL**: `http://localhost:3000/login`
- **Username**: `admin`
- **Password**: `admin123`
