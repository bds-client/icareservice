import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { PricelistCategory } from "@/lib/pricelist";
import type { SiteContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PricelistAdmin({ content, save }: { content: SiteContent; save: (key: "pricelist", value: PricelistCategory[]) => Promise<void> }) {
  const [v, setV] = useState<PricelistCategory[]>(content.pricelist);

  const setCat = (i: number, cat: PricelistCategory) => setV(v.map((c, j) => (j === i ? cat : c)));

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Pricelist</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Atur kategori perangkat, jenis servis, dan baris harga. Kosongkan kolom harga untuk menampilkan “Hubungi untuk harga” di website.
        </p>
      </div>

      {v.map((cat, ci) => (
        <div key={ci} className="relative rounded-2xl border border-border bg-card p-6">
          <button
            type="button"
            aria-label={`Hapus kategori ${cat.name}`}
            onClick={() => setV(v.filter((_, j) => j !== ci))}
            className="absolute right-4 top-4 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="max-w-xs space-y-2">
            <Label>Kategori perangkat</Label>
            <Input value={cat.name} onChange={(e) => setCat(ci, { ...cat, name: e.target.value })} />
          </div>

          <div className="mt-6 space-y-5">
            {cat.services.map((svc, si) => (
              <div key={si} className="relative rounded-xl border border-border p-4">
                <button
                  type="button"
                  aria-label={`Hapus servis ${svc.name}`}
                  onClick={() => setCat(ci, { ...cat, services: cat.services.filter((_, j) => j !== si) })}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="max-w-xs space-y-2">
                  <Label>Jenis servis</Label>
                  <Input
                    value={svc.name}
                    onChange={(e) =>
                      setCat(ci, { ...cat, services: cat.services.map((s, j) => (j === si ? { ...s, name: e.target.value } : s)) })
                    }
                  />
                </div>

                <div className="mt-4 space-y-3">
                  {svc.rows.map((row, ri) => (
                    <div key={ri} className="grid items-end gap-3 rounded-lg bg-secondary p-3 sm:grid-cols-[1fr_1.4fr_1fr_auto]">
                      <div className="space-y-1">
                        <Label className="text-xs">Model</Label>
                        <Input
                          value={row.model}
                          onChange={(e) =>
                            setCat(ci, { ...cat, services: cat.services.map((s, j) => j === si ? { ...s, rows: s.rows.map((r, k) => (k === ri ? { ...r, model: e.target.value } : r)) } : s) })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Garansi / Kualitas</Label>
                        <Input
                          value={row.quality}
                          onChange={(e) =>
                            setCat(ci, { ...cat, services: cat.services.map((s, j) => j === si ? { ...s, rows: s.rows.map((r, k) => (k === ri ? { ...r, quality: e.target.value } : r)) } : s) })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Harga (kosongkan bila belum ada)</Label>
                        <Input
                          value={row.price}
                          onChange={(e) =>
                            setCat(ci, { ...cat, services: cat.services.map((s, j) => j === si ? { ...s, rows: s.rows.map((r, k) => (k === ri ? { ...r, price: e.target.value } : r)) } : s) })
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Hapus baris"
                        onClick={() =>
                          setCat(ci, { ...cat, services: cat.services.map((s, j) => (j === si ? { ...s, rows: s.rows.filter((_, k) => k !== ri) } : s)) })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCat(ci, { ...cat, services: cat.services.map((s, j) => (j === si ? { ...s, rows: [...s.rows, { model: "", quality: "", price: "" }] } : s)) })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Tambah baris harga
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setCat(ci, { ...cat, services: [...cat.services, { name: "", rows: [] }] })}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah jenis servis
            </Button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => setV([...v, { name: "", services: [] }])}>
          <Plus className="mr-2 h-4 w-4" /> Tambah kategori perangkat
        </Button>
        <Button onClick={() => save("pricelist", v)}>
          <Save className="mr-2 h-4 w-4" /> Simpan
        </Button>
      </div>
    </section>
  );
}
