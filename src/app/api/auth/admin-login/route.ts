import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Hardcoded Superadmin credentials
    const validUsername = "admin";
    const validPassword = "admin123";

    if (
      (username === validUsername || username === "admin@rsmadjaya.co.id") &&
      password === validPassword
    ) {
      const response = NextResponse.json({
        success: true,
        message: "Login Superadmin berhasil",
        user: {
          username: "admin",
          email: "admin@rsmadjaya.co.id",
          name: "Super Administrator",
          role: "SUPERADMIN",
        },
      });

      // Set cookie session for admin
      response.cookies.set({
        name: "admin_token",
        value: "superadmin_session_token_rsmad_2026",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: "Username atau password admin salah (Gunakan: admin / admin123)",
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
