// src/app/admin/page.tsx
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-[#251D20] mb-1">Dashboard</h1>
      <p className="text-sm text-[#512333]/70 mb-6">
        Phase 2 — foundation in place.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/delivery"
          className="rounded-xl bg-white border border-[#EBCBD4]/40 p-5 hover:shadow-sm transition"
        >
          <p className="font-medium text-[#251D20]">Delivery zones</p>
          <p className="text-sm text-[#512333]/70 mt-1">
            Edit fees and coverage areas
          </p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-xl bg-white border border-[#EBCBD4]/40 p-5 hover:shadow-sm transition"
        >
          <p className="font-medium text-[#251D20]">Products</p>
          <p className="text-sm text-[#512333]/70 mt-1">
            Manage catalogue (Phase 3)
          </p>
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-xl bg-white border border-[#EBCBD4]/40 p-5 hover:shadow-sm transition"
        >
          <p className="font-medium text-[#251D20]">Orders</p>
          <p className="text-sm text-[#512333]/70 mt-1">Fulfilment (Phase 4)</p>
        </Link>
      </div>
    </main>
  );
}
