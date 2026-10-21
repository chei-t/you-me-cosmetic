// src/lib/auth/customer.ts
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'tawas_customer_session';

// Customer auth is optional — guest checkout is the default.
// Login only needed for order history and address book.
export async function getCurrentCustomer() {
  const customerId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!customerId) return null;
  return prisma.customer.findUnique({ where: { id: customerId } });
}

export async function loginCustomer(phone: string, password: string) {
  const customer = await prisma.customer.findUnique({ where: { phone } });
  if (!customer || !customer.passwordHash) return { ok: false as const };
  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid) return { ok: false as const };
  (await cookies()).set(SESSION_COOKIE, customer.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
  return { ok: true as const, customer };
}

export async function logoutCustomer() {
  (await cookies()).delete(SESSION_COOKIE);
}