import nodemailer from "nodemailer";

interface SendOtpEmailParams {
  to: string;
  otpCode: string;
  username?: string;
}

interface SendPhishingEmailParams {
  to: string;
  username?: string;
  simulationUrl?: string;
}

export async function sendPhishingSimulationEmail({
  to,
  username = "Staf RS",
  simulationUrl = "https://emr-rsmad-v2.vercel.app/auth-emr/login",
}: SendPhishingEmailParams) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const targetUrl = simulationUrl;

  if (!user || !pass) {
    console.warn("⚠️ SMTP_USER / SMTP_PASS belum disetting di .env. Menggunakan mode simulasi.");
    return {
      success: true,
      mode: "simulation",
      message: `[Simulasi] Link email ${targetUrl} siap dikirim ke ${to}`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"EMR RSMAD Security System" <${user}>`,
      replyTo: "noreply@rsmadjaya.co.id",
      to,
      subject: `[PENTING] Pembaharuan Keamanan Akses EMR RSMAD - Verifikasi Akun Anda`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
            .header { background: #1e40af; padding: 26px; text-align: center; color: #ffffff; }
            .content { padding: 30px 26px; }
            .btn-link { display: inline-block; background: #2563eb; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 14px; margin: 20px 0; box-shadow: 0 4px 10px rgba(37,99,235,0.3); }
            .url-box { background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 12px; word-break: break-all; font-family: monospace; color: #334155; border: 1px solid #cbd5e1; }
            .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0; font-size: 20px; font-weight: 700;">RSMAD - Sistem Informasi EDP</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Pemberitahuan Wajib Pembaharuan Keamanan Akun EMR</p>
            </div>
            <div class="content">
              <p style="font-size: 14px; margin: 0 0 12px 0;">Kepada Yth. <strong>${username}</strong>,</p>
              <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 16px 0;">
                Dalam rangka peningkatan standar keamanan data medis dan kepatuhan Perlindungan Data Pribadi (PDP) di Rumah Sakit, Anda diwajibkan untuk melakukan verifikasi ulang kredensial login portal EMR RSMAD Anda.
              </p>
              
              <div style="text-align: center;">
                <a href="${targetUrl}" target="_blank" class="btn-link">Klik Di Sini Untuk Login & Verifikasi EMR</a>
              </div>

              <p style="font-size: 12px; color: #64748b; margin-top: 20px; margin-bottom: 6px;">Atau buka tautan berikut di browser Anda:</p>
              <div class="url-box">${targetUrl}</div>
              
              <div style="font-size: 11px; color: #94a3b8; margin-top: 24px; padding-top: 16px; border-top: 1px dashed #e2e8f0;">
                <em>Catatan: Email ini dikirimkan secara otomatis oleh Tim IT/EDP Rumah Sakit. Silakan selesaikan sebelum akses EMR Anda dinonaktifkan sementara.</em>
              </div>
            </div>
            <div class="footer">
              © 2026 Rumah Sakit - EDP & IT Security Awareness Simulation Portal
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✓ Real simulation link email terkirim ke:", to, "MessageId:", info.messageId);

    return {
      success: true,
      mode: "real_smtp",
      messageId: info.messageId,
      message: `Email berisi link simulasi (${targetUrl}) berhasil terkirim ke Gmail ${to}`,
    };
  } catch (error: any) {
    console.error("❌ Gagal mengirim email simulasi via SMTP:", error);
    return {
      success: false,
      mode: "error",
      error: error?.message,
      message: `Gagal mengirim email: ${error?.message}`,
    };
  }
}

export async function sendOtpEmail({ to, otpCode, username = "Staf RS" }: SendOtpEmailParams) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"EMR RSMAD Security" <${user || "noreply@rsmadjaya.co.id"}>`;

  // If SMTP credentials are not yet set in .env, simulate gracefully
  if (!user || !pass) {
    console.warn("⚠️ SMTP_USER / SMTP_PASS belum disetting di .env. Menggunakan mode simulasi.");
    return {
      success: true,
      mode: "simulation",
      message: `[Simulasi] Kode OTP ${otpCode} siap dikirim ke ${to}`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"EMR RSMAD - Unit EDP Rumah Sakit" <${user}>`,
      replyTo: "noreply@rsmadjaya.co.id",
      to,
      subject: `[EMR RSMAD] Kode Verifikasi Keamanan OTP: ${otpCode}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
            .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: #1e3a8a; padding: 24px; text-align: center; color: #ffffff; }
            .content { padding: 28px 24px; text-align: center; }
            .otp-box { display: inline-block; background: #f8fafc; border: 2px dashed #3b82f6; border-radius: 8px; padding: 14px 28px; margin: 20px 0; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e3a8a; }
            .warning { font-size: 12px; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 10px; margin-top: 18px; text-align: left; }
            .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0; font-size: 20px; font-weight: 700;">EMR RSMAD - Verifikasi Akses Masuk</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.85;">Portal Keamanan Informasi Rekam Medis Elektronik</p>
            </div>
            <div class="content">
              <p style="font-size: 14px; margin: 0 0 10px 0;">Halo, <strong>${username}</strong></p>
              <p style="font-size: 13px; color: #475569; margin: 0;">Berikut adalah kode verifikasi OTP (One-Time Password) untuk otentikasi login sistem EMR Rumah Sakit Anda:</p>
              
              <div class="otp-box">${otpCode}</div>
              
              <p style="font-size: 12px; color: #64748b; margin: 0;">Kode ini hanya berlaku selama <strong>5 menit</strong>. Jangan berikan kode ini kepada siapa pun, termasuk staf IT.</p>
              
              <div class="warning">
                🔒 <strong>Peringatan Keamanan:</strong> Jika Anda tidak merasa melakukan permintaan login ke sistem EMR, segera laporkan ke Unit IT & EDP Rumah Sakit.
              </div>
            </div>
            <div class="footer">
              © 2026 Rumah Sakit - Unit EDP & Keamanan Informasi Medis
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✓ Real email OTP berhasil terkirim ke:", to, "MessageId:", info.messageId);

    return {
      success: true,
      mode: "real_smtp",
      messageId: info.messageId,
      message: `Kode OTP berhasil dikirimkan ke email ${to}`,
    };
  } catch (error: any) {
    console.error("❌ Gagal mengirim email via SMTP:", error);
    return {
      success: false,
      mode: "error",
      error: error?.message,
      message: `Gagal mengirim email: ${error?.message}`,
    };
  }
}
