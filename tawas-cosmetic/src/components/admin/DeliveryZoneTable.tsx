// src/components/admin/DeliveryZoneTable.tsx
"use client";
import { useState } from "react";

type Zone = {
  id: string;
  name: string;
  areas: string[];
  feeKes: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  freeThresholdKes: number | null;
  isActive: boolean;
  sortOrder: number;
};

type Editable = Omit<Zone, "areas"> & { areas: string };

export default function DeliveryZoneTable({
  initialZones,
}: {
  initialZones: Zone[];
}) {
  const [rows, setRows] = useState<Editable[]>(
    initialZones.map((z) => ({ ...z, areas: z.areas.join(", ") })),
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, patch: Partial<Editable>) {
    setRows((r) =>
      r.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  async function save(row: Editable) {
    setError(null);
    setSavingId(row.id);
    try {
      const res = await fetch("/api/admin/delivery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          name: row.name,
          areas: row.areas
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          feeKes: Number(row.feeKes),
          estimatedDaysMin: Number(row.estimatedDaysMin),
          estimatedDaysMax: Number(row.estimatedDaysMax),
          freeThresholdKes:
            row.freeThresholdKes === null || row.freeThresholdKes === undefined
              ? null
              : Number(row.freeThresholdKes),
          isActive: row.isActive,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Save failed");
        return;
      }
      setSavedId(row.id);
      setTimeout(
        () => setSavedId((cur) => (cur === row.id ? null : cur)),
        1500,
      );
    } catch {
      setError("Network error");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-[#EBCBD4]/40 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF6F0] text-left text-[#512333]/70">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Areas (comma-separated)</th>
              <th className="px-3 py-2">Fee (KES)</th>
              <th className="px-3 py-2">Days min</th>
              <th className="px-3 py-2">Days max</th>
              <th className="px-3 py-2">Free ≥ (KES)</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#EBCBD4]/30">
                <td className="px-3 py-2">
                  <input
                    value={row.name}
                    onChange={(e) => update(row.id, { name: e.target.value })}
                    className="w-32 rounded border border-[#EBCBD4] px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={row.areas}
                    onChange={(e) => update(row.id, { areas: e.target.value })}
                    className="w-64 rounded border border-[#EBCBD4] px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={row.feeKes}
                    onChange={(e) =>
                      update(row.id, { feeKes: Number(e.target.value) })
                    }
                    className="w-24 rounded border border-[#EBCBD4] px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={row.estimatedDaysMin}
                    onChange={(e) =>
                      update(row.id, {
                        estimatedDaysMin: Number(e.target.value),
                      })
                    }
                    className="w-16 rounded border border-[#EBCBD4] px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={row.estimatedDaysMax}
                    onChange={(e) =>
                      update(row.id, {
                        estimatedDaysMax: Number(e.target.value),
                      })
                    }
                    className="w-16 rounded border border-[#EBCBD4] px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={row.freeThresholdKes ?? ""}
                    placeholder="—"
                    onChange={(e) =>
                      update(row.id, {
                        freeThresholdKes:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="w-24 rounded border border-[#EBCBD4] px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={row.isActive}
                    onChange={(e) =>
                      update(row.id, { isActive: e.target.checked })
                    }
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => save(row)}
                    disabled={savingId === row.id}
                    className="rounded-lg bg-[#512333] text-white text-xs px-3 py-1.5 hover:bg-[#3d1a26] disabled:opacity-60"
                  >
                    {savingId === row.id
                      ? "Saving…"
                      : savedId === row.id
                        ? "Saved ✓"
                        : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#512333]/60">
        Upcountry's area list is intentionally blank — unmatched towns fall
        through to this zone via the quote endpoint.
      </p>
    </div>
  );
}
