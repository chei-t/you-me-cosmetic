// src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth/admin';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex">
      <AdminSidebar admin={{ name: admin.name, role: admin.role }} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}