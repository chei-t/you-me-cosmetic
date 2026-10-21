// src/components/admin/AdminSidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/inventory', label: 'Inventory' },
  { href: '/admin/delivery', label: 'Delivery zones' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminSidebar({ admin }: { admin: { name: string; role: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[#EBCBD4]/40 flex flex-col">
      <div className="px-5 py-5 border-b border-[#EBCBD4]/40">
        <p className="text-xs uppercase tracking-wider text-[#512333]/60">Tawas</p>
        <p className="font-semibold text-[#251D20]">Admin</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? 'bg-[#512333] text-white'
                  : 'text-[#251D20] hover:bg-[#EBCBD4]/30'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-[#EBCBD4]/40">
        <p className="text-sm font-medium text-[#251D20]">{admin.name}</p>
        <p className="text-xs text-[#512333]/60 mb-3">{admin.role}</p>
        <button
          onClick={logout}
          className="w-full rounded-lg border border-[#EBCBD4] text-sm py-2 hover:bg-[#EBCBD4]/30 transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}