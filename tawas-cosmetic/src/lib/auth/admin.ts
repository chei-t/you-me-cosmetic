// src/lib/auth/admin.ts
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE = 'tawas_admin_session';
const SESSION_DURATION_HOURS = 8;

// In production, use a signed JWT or iron-session instead of a plain HMAC.
// This is the minimum viable version for Phase 2.
function signSession(adminId: string, expiresAt: number): string {
  const secret = process.env.ADMIN_SESSION_SECRET!;
  const payload = `${adminId}.${expiresAt}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

function verifySession(token: string): { adminId: string } | null {
  const [adminId, expiresAtStr, hmac] = token.split('.');
  if (!adminId || !expiresAtStr || !hmac) return null;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (Date.now() > expiresAt) return null;
  const secret = process.env.ADMIN_SESSION_SECRET!;
  const expected = crypto.createHmac('sha256', secret).update(`${adminId}.${expiresAt}`).digest('hex');
  if (hmac !== expected) return null;
  return { adminId };
}

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.isActive) return { ok: false as const, error: 'Invalid credentials' };

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return { ok: false as const, error: 'Invalid credentials' };

  const expiresAt = Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000;
  const token = signSession(admin.id, expiresAt);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_HOURS * 60 * 60,
  });

  return { ok: true as const, admin };
}

export async function getCurrentAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = verifySession(token);
  if (!session) return null;
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminId, isActive: true },
  });
  return admin;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('UNAUTHORIZED');
  return admin;
}

export async function logoutAdmin() {
  (await cookies()).delete(SESSION_COOKIE);
}