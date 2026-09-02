import { NextResponse } from "next/server";
import { sentEmailsLogs } from "@/lib/sentEmailsStore";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: sentEmailsLogs,
      count: sentEmailsLogs.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil log email terkirim",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
