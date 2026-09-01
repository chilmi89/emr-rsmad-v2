"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Key,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Activity,
  Mail,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface UserItem {
  id: string;
  username: string;
  email: string;
  password: string;
  tokenGmail: string | null;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const result = await res.json();
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (e) {
      console.warn("Failed to fetch dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalUsers = users.length;
  const activeTokens = users.filter((u) => u.tokenGmail).length;
  const recentLogins = users.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Dashboard Keamanan Informasi
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Supabase
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ringkasan pemantauan akun staf rumah sakit dan interaksi simulasi phishing EMR RSMAD.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
          </button>

          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Kelola Akun Users</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Akun */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Akun Terdaftar
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalUsers}</span>
            <span className="text-xs text-slate-400">Akun Pegawai</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-400 font-medium">
            Tersimpan di Supabase PostgreSQL
          </div>
        </div>

        {/* Card 2: OTP / Token Aktif */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Token & OTP Terkirim
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{activeTokens}</span>
            <span className="text-xs text-emerald-400">Tersinkronisasi</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            Terkirim via Nodemailer / Gmail SMTP
          </div>
        </div>

        {/* Card 3: Interaksi Simulasi */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Aktivitas Simulasi
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalUsers}</span>
            <span className="text-xs text-indigo-300">Total Sesi</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-400 font-medium">
            Tercatat di Portal EMR RSMAD
          </div>
        </div>

        {/* Card 4: Kesiapan Audit */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kesiapan KARS/STARKES
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">100%</span>
            <span className="text-xs text-amber-400">Kepatuhan PDP</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-medium">
            Standar Akreditasi Rumah Sakit
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Feed Akun Users Terbaru */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Akun Pegawai & Interaksi Terbaru
              </h2>
            </div>
            <Link
              href="/admin/users"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>Lihat Semua Akun</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
                <tr>
                  <th className="px-5 py-3">Username</th>
                  <th className="px-5 py-3">Email Akun</th>
                  <th className="px-5 py-3">Password</th>
                  <th className="px-5 py-3">OTP / Token Gmail</th>
                  <th className="px-5 py-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentLogins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                      Belum ada data user.
                    </td>
                  </tr>
                ) : (
                  recentLogins.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold text-[10px]">
                            {user.username.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{user.username}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-300">{user.email}</td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-emerald-300 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {user.password}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <code className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded font-mono text-[11px]">
                          {user.tokenGmail || "-"}
                        </code>
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Simulation Info */}
        <div className="space-y-5">
          {/* Quick Simulation Launcher */}
          <div className="bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 border border-blue-800/40 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Simulasi EMR RSMAD</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Uji coba alur 2 Langkah (Username/Password ➡️ CAPTCHA, Email & OTP) yang terhubung langsung ke database Supabase dan pengiriman email asli.
            </p>
            <div className="pt-2">
              <Link
                href="/auth-emr/login"
                target="_blank"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors"
              >
                <span>Buka Halaman Simulasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Nav Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Akses Cepat Superadmin
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-xs font-semibold text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Kelola Akun Users (CRUD)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/admin/activity"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-xs font-semibold text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Log Aktivitas Users</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
