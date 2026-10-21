// src/app/admin/delivery/page.tsx
import DeliveryZoneTable from "@/components/admin/DeliveryZoneTable";
import { prisma } from "@/lib/db";

export default async function AdminDeliveryPage() {
  const zones = await prisma.deliveryZone.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return (
    <main className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-[#251D20] mb-1">
        Delivery zones
      </h1>
      <p className="text-sm text-[#512333]/70 mb-6">
        These zones power the checkout delivery fee. Edit any row and save.
      </p>
      <DeliveryZoneTable initialZones={zones} />
    </main>
  );
}
