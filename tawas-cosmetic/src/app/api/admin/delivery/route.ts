// src/app/api/admin/delivery/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";
import { z } from "zod";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const zones = await prisma.deliveryZone.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ zones });
}

const UpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  areas: z.array(z.string()).optional(),
  feeKes: z.number().int().min(0).optional(),
  estimatedDaysMin: z.number().int().min(0).optional(),
  estimatedDaysMax: z.number().int().min(0).optional(),
  freeThresholdKes: z.number().int().min(0).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { id, ...updates } = parsed.data;
  const zone = await prisma.deliveryZone.update({
    where: { id },
    data: updates,
  });
  return NextResponse.json({ zone });
}
