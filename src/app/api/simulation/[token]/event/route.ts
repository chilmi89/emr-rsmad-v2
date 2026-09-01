import { NextResponse } from "next/server";
import { recordActivity } from "@/lib/activityStore";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const { eventType } = body;

    if (eventType === "OPENED") {
      recordActivity({
        eventType: "PAGE_OPENED",
        actionName: "Buka Halaman Simulasi",
        userIdentifier: token !== "demo-token" ? `Token: ${token}` : "Pengunjung Baru",
        details: `Peserta membuka halaman /auth-emr/login (Token: ${token})`,
        status: "INFO",
        ipAddress: "192.168.10.x",
        device: "Web Browser",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Event tercatat",
      token,
      eventType,
    });
  } catch (error: any) {
    return NextResponse.json({ success: true });
  }
}
