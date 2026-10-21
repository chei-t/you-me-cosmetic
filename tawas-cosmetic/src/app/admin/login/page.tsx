// src/app/admin/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Login failed');
        setLoading(false);
        return;
      }
      router.replace(from);
      router.refresh();
    } catch {
      setError('Network error — try again');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF6F0] px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#EBCBD4]/40 p-8"
      >
        <h1 className="text-2xl font-semibold text-[#251D20] mb-1">Tawas Admin</h1>
        <p className="text-sm text-[#512333]/70 mb-6">Sign in to manage the store.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-[#251D20] mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="w-full mb-4 rounded-lg border border-[#EBCBD4] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C05B7C]/40"
        />

        <label className="block text-sm font-medium text-[#251D20] mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full mb-6 rounded-lg border border-[#EBCBD4] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C05B7C]/40"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#512333] text-white text-sm font-medium py-2.5 hover:bg-[#3d1a26] transition disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}