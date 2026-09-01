import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { recordActivity } from "@/lib/activityStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, email, token } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email wajib diisi" },
        { status: 400 }
      );
    }

    // Generate 6-digit simulation OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Use username & password from Step 1 if provided
    const targetUsername = username || email.split("@")[0];
    const targetPassword = password || "test";

    // Save/Update directly in Supabase so username, password, email, and OTP token match 100%!
    let matchedUser = null;
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username: targetUsername }],
        },
      });

      if (existingUser) {
        matchedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            username: targetUsername,
            email: email,
            password: targetPassword,
            tokenGmail: generatedOtp,
          },
        });
      } else {
        matchedUser = await prisma.user.create({
          data: {
            username: targetUsername,
            email: email,
            password: targetPassword,
            tokenGmail: generatedOtp,
          },
        });
      }
    } catch (e) {
      console.warn("DB update error in send-otp:", e);
    }

    // Send real email via Nodemailer
    const emailResult = await sendOtpEmail({
      to: email,
      otpCode: generatedOtp,
      username: targetUsername,
    });

    // Record activity log for Superadmin
    recordActivity({
      eventType: "OTP_REQUESTED",
      actionName: "Permintaan OTP ke Email",
      userIdentifier: email,
      details: `Kode OTP ${generatedOtp} dikirimkan ke email ${email}`,
      status: "SUCCESS",
      ipAddress: "192.168.10.x",
      device: "Web Browser",
    });

    return NextResponse.json({
      success: true,
      message: emailResult.success
        ? `Kode OTP verifikasi berhasil dikirimkan ke email ${email}.`
        : `Simulasi: Kode OTP disiapkan untuk ${email}.`,
      emailStatus: emailResult.mode,
      otpPreview: generatedOtp,
      userFound: true,
      username: targetUsername,
      tokenGmail: generatedOtp,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memproses pengiriman OTP",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
