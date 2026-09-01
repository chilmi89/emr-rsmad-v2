"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Search,
  RefreshCw,
  Clock,
  Key,
  Mail,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Filter,
  Globe,
  Smartphone,
  Laptop,
} from "lucide-react";

interface ActivityLogItem {
  id: string;
  timestamp: string;
  eventType: string;
  actionName: string;
  userIdentifier: string;
  details: string;
  status: "SUCCESS" | "INFO" | "WARNING";
  ipAddress?: string;
  device?: string;
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = filterType === "ALL" 
        ? "/api/admin/activity" 
        : `/api/admin/activity?filter=${filterType}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setLogs(result.data || []);
      }
    } catch (e) {
      console.warn("Failed to fetch activity logs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterType]);

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.userIdentifier.toLowerCase().includes(q) ||
      log.actionName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  const getBadgeStyle = (type: string, status: string) => {
    switch (type) {
      case "STEP1_LOGIN":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "OTP_REQUESTED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "VERIFICATION_SUBMIT":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-700";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "STEP1_LOGIN":
        return <User className="w-4 h-4 text-amber-400" />;
      case "OTP_REQUESTED":
        return <Mail className="w-4 h-4 text-blue-400" />;
      case "VERIFICATION_SUBMIT":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Log Aktivitas Users & Simulasi
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Realtime Activity Logs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Riwayat interaksi langkah demi langkah (buka halaman, input login, kirim OTP ke email, verifikasi selesai).
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors flex items-center gap-2 text-xs font-semibold"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
          <span>Segarkan Log</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user, aktivitas, keterangan..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === "ALL"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Semua Log
          </button>
          <button
            onClick={() => setFilterType("STEP1_LOGIN")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === "STEP1_LOGIN"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Input Kredensial
          </button>
          <button
            onClick={() => setFilterType("OTP_REQUESTED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === "OTP_REQUESTED"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Kirim OTP
          </button>
          <button
            onClick={() => setFilterType("VERIFICATION_SUBMIT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === "VERIFICATION_SUBMIT"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Selesai Verifikasi
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Jejak Interaksi Pengguna
          </h2>
          <span className="text-xs text-slate-400">
            Total <strong>{filteredLogs.length}</strong> aktivitas ditampilkan
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
              <span>Memuat jejak aktivitas...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Activity className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="font-semibold text-slate-300">Belum ada log aktivitas yang cocok.</p>
            </div>
          ) : (
            filteredLogs.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: User Info & Event Icon */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 shadow-inner">
                    {getEventIcon(item.eventType)}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{item.actionName}</span>
                      <span className="text-xs text-slate-400">({item.userIdentifier})</span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(item.eventType, item.status)}`}>
                        {item.eventType.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800/80">
                      {item.details}
                    </p>
                  </div>
                </div>

                {/* Right: Timestamp & Info */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 text-right flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {new Date(item.timestamp).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    IP: {item.ipAddress || "192.168.10.x"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
