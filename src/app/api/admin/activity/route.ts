import { NextResponse } from "next/server";
import { activityLogs, recordActivity, ActivityLog } from "@/lib/activityStore";

// GET /api/admin/activity - Retrieve all activity logs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");

    let filtered = activityLogs;
    if (filter && filter !== "ALL") {
      filtered = activityLogs.filter((log) => log.eventType === filter);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      count: filtered.length,
      total: activityLogs.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil log aktivitas",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/activity - Record a new activity event
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventType, actionName, userIdentifier, details, status } = body;

    if (!actionName || !eventType) {
      return NextResponse.json(
        { success: false, message: "Field eventType dan actionName wajib diisi" },
        { status: 400 }
      );
    }

    const recorded = recordActivity({
      eventType,
      actionName,
      userIdentifier: userIdentifier || "Anonim / Tamu",
      details: details || "Aktivitas tercatat",
      status: status || "INFO",
      ipAddress: "192.168.10.x",
      device: "Web Browser",
    });

    return NextResponse.json({
      success: true,
      data: recorded,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mencatat log",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
