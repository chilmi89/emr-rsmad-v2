import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { username, email, password, tokenGmail } = body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(password && { password }),
        ...(tokenGmail !== undefined && { tokenGmail }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data user berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui user",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus user",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
