// src/app/api/auth/admin/login/route.ts
import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth/admin";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const result = await loginAdmin(body.email, body.password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    admin: {
      id: result.admin.id,
      email: result.admin.email,
      name: result.admin.name,
      role: result.admin.role,
    },
  });
}
