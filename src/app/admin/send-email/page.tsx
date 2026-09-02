"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";

interface UserItem {
  id: string;
  username: string;
  email: string;
}

export default function AdminSendEmailPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Form State
  const [targetEmail, setTargetEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [simulationUrl, setSimulationUrl] = useState("https://emr-rsmad-v2.vercel.app/auth-emr/login");
  const [selectedUserId, setSelectedUserId] = useState("");

  // Status State
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load registered users for dropdown selection
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const result = await res.json();
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (err) {
      console.warn("Failed to load users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // When a registered user is selected from dropdown
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    if (!userId) {
      setTargetEmail("");
      setRecipientName("");
      return;
    }

    const found = users.find((u) => u.id === userId);
    if (found) {
      setTargetEmail(found.email);
      setRecipientName(found.username);
    }
  };

  // Submit Handler
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail) {
      setErrorMessage("Email penerima wajib diisi");
      return;
    }

    setSending(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/admin/send-simulation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          username: recipientName || "Staf RS",
          simulationUrl: simulationUrl,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setSuccessMessage(
          result.message || `Email berisi link simulasi (${simulationUrl}) berhasil terkirim ke ${targetEmail}!`
        );
      } else {
        setErrorMessage(result.message || "Gagal mengirim email simulasi");
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan koneksi jaringan");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Kirim Email Simulasi Phishing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Gmail SMTP Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Kirimkan email pemberitahuan simulasi EMR berisikan link resmi ke Gmail staf/target.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={simulationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>Tes Buka Link</span>
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Kirim Email */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-400" />
              Formulir Pengiriman Email Target
            </h2>
            <span className="text-xs text-slate-400">RSMAD EMR Security Awareness</span>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSendEmail} className="space-y-4">
            {/* Quick Select from Database */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pilih Dari Akun Terdaftar (Opsional)
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => handleUserSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- Manual Input Email / Pilih User --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Tujuan (Gmail Staf) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="contoh.staf@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Penerima (Sapaan Email)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="dr. Hendra Pratama"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Simulation Link URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Link URL Simulasi (Akan Dimuat Dalam Email) *
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={simulationUrl}
                  onChange={(e) => setSimulationUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Link ini akan tampil sebagai tombol dan teks link aktif pada Gmail penerima.
              </p>
            </div>

            {/* Preview Target URL */}
            <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-lg space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Pratinjau Link Akhir Di Gmail:
              </span>
              <p className="text-xs font-mono text-emerald-400 break-all">
                {simulationUrl}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                {sending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Kirim Email Ke Gmail Sekarang</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Information & Preview Card */}
        <div className="space-y-5">
          {/* Card Email Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Informasi Template Email</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Email yang dikirimkan menggunakan header dan format resmi <strong>RSMAD EDP Security</strong> dengan subjek:
            </p>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-amber-300 font-mono">
              [PENTING] Pembaharuan Keamanan Akses EMR RSMAD - Verifikasi Akun Anda
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Di dalam email Gmail penerima, akan tersedia tombol interaktif langsung ke:
            </p>
            <div className="p-2 bg-blue-950/40 border border-blue-800/40 rounded text-[11px] font-mono text-blue-300 truncate">
              {simulationUrl}
            </div>
          </div>

          {/* Quick Info Audit */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Integrasi Log Aktivitas
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Setiap kali email simulasi dikirimkan dari halaman ini, riwayat pengiriman akan otomatis tercatat secara real-time di halaman <strong>Aktivitas Users</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
