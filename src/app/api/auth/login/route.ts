import { NextRequest, NextResponse } from "next/server";
import { createSession, clearSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Hardcoded Superadmin Authentication
    if (
      (username === "admin" || username === "admin@rsmad.co.id") &&
      password === "admin123"
    ) {
      const adminUser = {
        id: "admin-super-id",
        name: "Super Administrator EDP",
        username: "admin",
        role: "ADMIN",
      };

      await createSession({
        id: adminUser.id,
        role: adminUser.role,
        name: adminUser.name,
        username: adminUser.username,
      });

      return NextResponse.json({
        success: true,
        message: "Login berhasil",
        admin: {
          id: adminUser.id,
          name: adminUser.name,
          username: adminUser.username,
          role: adminUser.role,
        },
      });
    }

    return NextResponse.json(
      { error: "Username atau password salah" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true, message: "Logged out" });
}
