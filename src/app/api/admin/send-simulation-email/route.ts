import { NextResponse } from "next/server";
import { sendPhishingSimulationEmail } from "@/lib/email";
import { recordActivity } from "@/lib/activityStore";
import { recordSentEmail } from "@/lib/sentEmailsStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, simulationUrl } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email tujuan wajib diisi",
        },
        { status: 400 }
      );
    }

    const customUrl = simulationUrl || "https://emr-rsmad-v2.vercel.app/auth-emr/login";

    // Send the simulation email with the link
    const result = await sendPhishingSimulationEmail({
      to: email,
      username: username || "Staf RS",
      simulationUrl: customUrl,
    });

    if (result.success) {
      // Record Sent Email Log
      recordSentEmail({
        recipientEmail: email,
        recipientName: username || "Staf RS",
        simulationUrl: customUrl,
        status: "SUCCESS",
        message: result.message,
      });

      // Record Activity log
      try {
        recordActivity({
          eventType: "OTP_REQUESTED",
          actionName: "Pengiriman Link Simulasi Phishing",
          userIdentifier: email,
          details: `Link simulasi (${customUrl}) dikirimkan ke Gmail ${email}`,
          status: "SUCCESS",
        });
      } catch (e) {
        console.warn("Could not log activity:", e);
      }

      return NextResponse.json({
        success: true,
        message: result.message,
        mode: result.mode,
      });
    } else {
      recordSentEmail({
        recipientEmail: email,
        recipientName: username || "Staf RS",
        simulationUrl: customUrl,
        status: "FAILED",
        message: result.message || "Gagal dikirim",
      });

      return NextResponse.json(
        {
          success: false,
          message: result.message || "Gagal mengirim email simulasi",
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error sending simulation email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal server saat pengiriman email",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
