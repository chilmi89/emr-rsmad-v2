"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  X,
  HelpCircle,
} from "lucide-react";

export default function EmrBlankDashboardPage() {
  const [showHackModal, setShowHackModal] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 font-sans flex flex-col items-center justify-center p-6 select-none">
      {/* ⚪ Minimal Blank White Dashboard with Only "Bantuan IT" Button */}
      <div className="text-center space-y-6 max-w-md w-full">
        {/* Simple Clean Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            EMR RSMAD
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Sistem Informasi Pelayanan Medis Rumah Sakit
          </p>
        </div>

        {/* Minimal White Box */}
        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm space-y-5">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-800">
              Pusat Layanan Bantuan Sistem
            </h2>
            <p className="text-xs text-slate-500">
              Klik tombol di bawah jika Anda memerlukan bantuan teknis IT atau kendala akses akun.
            </p>
          </div>

          {/* 🔴 TOMBOL BANTUAN IT */}
          <button
            type="button"
            onClick={() => setShowHackModal(true)}
            className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Bantuan IT / EDP</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Unit EDP & Keamanan Sistem Informasi RSMAD
        </p>
      </div>

      {/* ☠️ PURE HACKED MODAL (SKULL + "AKUN DAN SISTEM ANDA TELAH TERHACK") ☠️ */}
      {showHackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-950 border-2 border-red-600 rounded-2xl shadow-2xl max-w-md w-full p-8 text-white relative overflow-hidden text-center space-y-6">
            {/* Close button */}
            <button
              onClick={() => setShowHackModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Red radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-32 bg-red-600/30 blur-3xl pointer-events-none" />

            {/* ☠️ Glowing Hacker Skull Graphic */}
            <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-red-500 shadow-2xl shadow-red-600/60">
              <img
                src="/images/hacker-skull-alert.jpg"
                alt="System Breach"
                className="w-full h-full object-cover"
              />
            </div>

            {/* ⚠️ Hacked Headline Only */}
            <div className="space-y-2 pt-2">
              <div className="inline-block px-3 py-1 bg-red-950 border border-red-500/60 rounded-full text-red-400 font-mono text-[11px] font-extrabold tracking-wider uppercase">
                ⚠️ SYSTEM ALERT
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                AKUN DAN SISTEM ANDA TELAH TERHACK
              </h2>
            </div>

            {/* Close button */}
            <div className="pt-3">
              <button
                onClick={() => setShowHackModal(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all uppercase tracking-wider"
              >
                Tutup Peringatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
