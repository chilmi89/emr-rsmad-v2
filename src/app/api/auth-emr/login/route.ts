import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { recordActivity } from "@/lib/activityStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, email, captcha, otp, token } = body;

    const dynamicToken = token && token !== "demo-token"
      ? token
      : `tok_gmail_${Math.random().toString(36).substring(2, 8)}`;

    // Look up and update user in DB
    let user = null;
    try {
      if (email || username) {
        const existing = await prisma.user.findFirst({
          where: {
            OR: [
              ...(email ? [{ email }] : []),
              ...(username ? [{ username }] : []),
            ],
          },
        });

        if (existing) {
          user = await prisma.user.update({
            where: { id: existing.id },
            data: {
              ...(username && { username }),
              ...(email && { email }),
              ...(password && { password }),
              ...(otp && { tokenGmail: otp }),
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn("Prisma user lookup warning in login:", dbErr);
    }

    // Record activity log for Superadmin
    recordActivity({
      eventType: "VERIFICATION_SUBMIT",
      actionName: "Submit Login & Verifikasi OTP",
      userIdentifier: username || email || "Peserta EMR",
      details: `User menyelesaikan form: Captcha '${captcha}', OTP '${otp}' (Sesi Simulasi Selesai)`,
      status: "SUCCESS",
      ipAddress: "192.168.10.x",
      device: "Web Browser",
    });

    return NextResponse.json({
      success: true,
      message: "Percobaan login simulasi tercatat",
      isSimulation: true,
      data: {
        emailSubmitted: email,
        username: user?.username || username || "Staf RS",
        tokenGmail: user?.tokenGmail || otp || dynamicToken,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada simulasi EMR",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
