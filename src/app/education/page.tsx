"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldAlert,
  Lock,
  Eye,
  AlertTriangle,
  FileText,
  Building2,
  CheckCircle2,
  HelpCircle,
  Search,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  PhoneCall,
  KeyRound,
  FileCheck2,
} from "lucide-react";

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const modules = [
    {
      id: "phishing-basics",
      category: "dasar",
      title: "1. Apa itu Phishing & Bahayanya di Rumah Sakit?",
      icon: ShieldAlert,
      tag: "Fundamental",
      summary:
        "Phishing adalah upaya rekayasa sosial (social engineering) untuk memanipulasi pegawai agar menyerahkan akses akun atau mengklik tautan berbahaya.",
      content: [
        "Di lingkungan rumah sakit, penyerang sering memalsukan pesan dari 'Tim IT', 'Manajemen SDM', atau 'Komite Akreditasi' untuk memperoleh akses sistem rekam medis elektronik.",
        "Kebocoran satu akun staf medis dapat membuka akses ke ribuan riwayat kesehatan pasien dan mengganggu operasional pelayanan gawat darurat.",
      ],
      tips: [
        "Waspadai pesan yang bernada mendesak (urgent) seperti ancaman penutupan akun dalam 1 jam.",
        "Tim IT resmi rumah sakit tidak pernah meminta password melalui pesan WhatsApp atau email.",
      ],
    },
    {
      id: "check-url",
      category: "teknis",
      title: "2. Cara Memeriksa URL & Alamat Server EMR/SIMRS",
      icon: Eye,
      tag: "Penting",
      summary:
        "Selalu periksa address bar browser Anda sebelum mengetikkan nama pengguna dan kata sandi.",
      content: [
        "Sistem EMR/SIMRS rumah sakit berjalan pada alamat server internal resmi (misalnya IP internal LAN rumah sakit atau subdomain resmi).",
        "Penyerang sering menggunakan domain tiruan yang mirip atau link pemendek URL (seperti bit.ly, tinyurl, atau domain asing .xyz/.top).",
      ],
      tips: [
        "Bookmark alamat portal EMR resmi di browser kerja Anda.",
        "Jangan login melalui link yang dikirim dari grup media sosial tidak resmi.",
      ],
    },
    {
      id: "sender-verification",
      category: "teknis",
      title: "3. Memeriksa Alamat Pengirim Pesan",
      icon: Search,
      tag: "Waspada",
      summary:
        "Nama pengirim (Display Name) dapat dipalsukan. Selalu periksa detail alamat email sebenarnya.",
      content: [
        "Email penyerang mungkin menampilkan nama 'EDP Rumah Sakit', namun alamat email aslinya adalah 'admin-helpdesk@gmail.com' atau 'support@server-luar.com'.",
        "Semua pengumuman IT resmi hanya dikirim melalui domain email internal rumah sakit atau nota dinas resmi.",
      ],
      tips: [
        "Arahkan kursor (*hover*) pada nama pengirim untuk melihat alamat email aslinya.",
      ],
    },
    {
      id: "password-hygiene",
      category: "keamanan",
      title: "4. Manajemen Kata Sandi SIMRS & Larangan Password Reuse",
      icon: KeyRound,
      tag: "Praktik Terbaik",
      summary:
        "Jangan gunakan password yang sama untuk akun SIMRS medis dan akun media sosial pribadi.",
      content: [
        "Jika salah satu layanan online pribadi Anda mengalami kebocoran data (*credential stuffing*), penyerang akan mencoba password yang sama pada akun kerja rumah sakit Anda.",
        "Gunakan kombinasi minimal 10-12 karakter dengan huruf besar, huruf kecil, angka, dan simbol.",
      ],
      tips: [
        "Ubah password akun secara berkala melalui menu resmi EMR.",
        "Jangan menempelkan kertas catatan password di monitor komputer poliklinik atau nurse station!",
      ],
    },
    {
      id: "patient-data-privacy",
      category: "regulasi",
      title: "5. Perlindungan Data Rekam Medis & Regulasi UU PDP",
      icon: FileCheck2,
      tag: "Kepatuhan Hukum",
      summary:
        "Data kesehatan pasien adalah data pribadi yang bersifat spesifik/sensitif yang dilindungi oleh undang-undang.",
      content: [
        "Berdasarkan UU Perlindungan Data Pribadi (UU No. 27/2022) dan Permenkes tentang Rekam Medis Elektronik, rumah sakit wajib menjaga kerahasiaan, keutuhan, dan ketersediaan data pasien.",
        "Pelanggaran atau kebocoran data akibat kelalaian kredensial dapat berimplikasi sanksi hukum dan membatalkan akreditasi rumah sakit.",
      ],
      tips: [
        "Selalu lakukan Log Out ketika meninggalkan komputer poliklinik/ruang rawat.",
        "Jangan mengambil foto layar SIMRS yang memuat identitas pasien (No. RM, NIK, Diagnosa) untuk media sosial.",
      ],
    },
    {
      id: "incident-reporting",
      category: "prosedur",
      title: "6. Prosedur Pelaporan Insiden & Kontak IT/EDP",
      icon: PhoneCall,
      tag: "Tindakan Cepat",
      summary:
        "Mengetahui langkah cepat yang harus diambil jika tidak sengaja mengklik tautan mencurigakan.",
      content: [
        "Jika Anda menyadari telah memasukkan data pada halaman palsu, **jangan panik** dan segera laporkan.",
        "Laporan cepat memungkinkan tim IT/EDP segera mereset sesi, mengganti password, dan mencegah akses tidak sah sebelum penyerang mengeksploitasi sistem.",
      ],
      tips: [
        "Hubungi Helpdesk IT/EDP Rumah Sakit melalui nomor ekstensi internal.",
        "Kirim tangkapan layar email atau tautan mencurigakan ke tim keamanan informasi IT.",
      ],
    },
  ];

  const filteredModules = modules.filter((m) => {
    const matchesCategory = activeTab === "all" || m.category === activeTab;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  Hospital Security Awareness Portal
                </h1>
                <p className="text-xs text-slate-500">
                  Panduan Keamanan Informasi Staf & Tenaga Medis Rumah Sakit
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              Portal Admin IT
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-medium text-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standar Keamanan Informasi & Akreditasi Rumah Sakit</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Bersama Menjaga Kerahasiaan Data Medis Pasien
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Pegawai dan tenaga medis adalah garda terdepan pertahanan keamanan siber rumah sakit. Pelajari cara mengenali simulasi phishing, mengamankan akun SIMRS, dan melindungi privasi pasien.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari topik keamanan informasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: "all", label: "Semua Topik" },
            { id: "dasar", label: "Dasar Phishing" },
            { id: "teknis", label: "Pemeriksaan URL & Email" },
            { id: "keamanan", label: "Manajemen Password" },
            { id: "regulasi", label: "Data Pasien & UU PDP" },
            { id: "prosedur", label: "Pelaporan Insiden" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {filteredModules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {item.content.map((p, idx) => (
                      <p key={idx} className="text-xs text-slate-600 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>

                  {item.tips && item.tips.length > 0 && (
                    <div className="bg-amber-50/80 rounded-lg p-3 border border-amber-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                        <span>Tips Praktis:</span>
                      </div>
                      <ul className="text-xs text-amber-900/90 space-y-1 pl-5 list-disc">
                        {item.tips.map((tip, tIdx) => (
                          <li key={tIdx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 mt-6">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">
              Topik tidak ditemukan
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Coba gunakan kata kunci pencarian yang lain.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Unit IT & EDP Rumah Sakit - Program Security Awareness</p>
          <div className="flex items-center gap-4">
            <span>Standar Audit Akreditasi RS</span>
            <span>•</span>
            <Link href="/login" className="text-blue-600 hover:underline">
              Login Admin IT
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
