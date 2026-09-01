# Hospital Security Awareness & Phishing Simulation (agent.md)

## 1. Project Overview
- **Project Name:** hospital-security-awareness
- **Type:** Web Application (Next.js App Router + TypeScript + Tailwind CSS)
- **Target User:** IT/EDP Rumah Sakit (Admin) & Pegawai Rumah Sakit (Peserta Simulasi)
- **Purpose:** Sistem simulasi phishing internal & security awareness terisolasi untuk mengukur kewaspadaan pegawai, edukasi keamanan informasi, dan pelaporan audit/akreditasi rumah sakit.

## 2. Important Safety Boundaries
- Aplikasi ini adalah sarana **edukasi dan simulasi kesadaran keamanan**, bukan alat peretasan / credential harvesting.
- **TIDAK PERNAH** menyimpan password pegawai dalam bentuk apa pun.
- **TIDAK PERNAH** menghubungkan / merusak sistem login SIMRS produksi.
- Semua halaman simulasi terisolasi dan langsung memberikan edukasi (*instant learning moment*) setelah interaksi simulasi.
- Bekerja optimal di jaringan LAN / intranet rumah sakit tanpa memerlukan domain publik.

## 3. Architecture & Routing
- `/login` : Admin / Petugas IT Login
- `/admin` : Dashboard Metrik & Analitik
- `/admin/employees` : Manajemen Data Pegawai (minimal data)
- `/admin/campaigns` : Manajemen Kampanye Simulasi & Generate Token
- `/admin/scenarios` : Template Skenario (Termasuk EMR Login, Update Sistem, dll.)
- `/admin/results` & `/admin/reports` : Evaluasi, Statistik Departemen & Export Laporan
- `/auth-emr/login` : Halaman Simulasi Peserta (Unik/Token based, login EMR RSMAD)
- `/education` : Portal Modul Keamanan Informasi & Data Pasien

## 4. UI Specification (EMR Simulation Panel)
- Menyesuaikan tampilan login portal medis/EMR rumah sakit (seperti referensi EMR RSMAD).
- Hero section sebelah kiri dengan background foto rumah sakit, judul aplikasi, versi, dan pesan sambutan.
- Card login panel sebelah kanan dengan input Username, Password, dan tombol Login (Simulasi aman).
- Trigger pencatatan event `ATTEMPTED_LOGIN` / `CLICKED` tanpa menyimpan data sensitif, langsung mengarahkan ke halaman edukasi.
