import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/admin/users - List all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data users dari database",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, tokenGmail } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, Email, dan Password wajib diisi",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Username atau Email sudah terdaftar dalam sistem",
        },
        { status: 409 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        tokenGmail: tokenGmail || `token_${Math.random().toString(36).substring(2, 10)}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data akun user berhasil ditambahkan",
      data: newUser,
    });
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan user",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
