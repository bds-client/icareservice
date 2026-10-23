import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSiteContent } from "@/lib/content-context";
import { saveSection } from "@/lib/content.functions";
import { testimonialsSchema } from "@/lib/testimonials";

type Draft = { name: string; branch: string; text: string; rating: number; source: string; consent: boolean };

export function TestimonialsAdmin() {
  const { testimonials, branches } = useSiteContent();
  const [items, setItems] = useState<Draft[]>(testimonials);
  const [saving, setSaving] = useState(false);
  const save = useServerFn(saveSection);
  const qc = useQueryClient();
  const update = (index: number, patch: Partial<Draft>) => setItems(items.map((item, i) => i === index ? { ...item, ...patch } : item));
  async function submit() {
    const parsed = testimonialsSchema.safeParse(items);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Periksa isian testimoni"); return; }
    setSaving(true);
    try {
      await save({ data: { key: "testimonials", value: parsed.data } });
      await qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Testimoni tersimpan dan tampil di website.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Gagal menyimpan testimoni"); }
    finally { setSaving(false); }
  }
  return <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-2xl font-semibold">Testimoni Pelanggan</h2>
      <span className="text-sm text-muted-foreground">{items.length} testimoni · target minimal 5</span>
    </div>
    {items.map((item, i) => <div key={i} className="space-y-4 rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between"><h3 className="font-semibold">Testimoni {i + 1}</h3><Button variant="ghost" size="icon" aria-label={`Hapus testimoni ${i + 1}`} title="Hapus testimoni" onClick={() => setItems(items.filter((_, j) => i !== j))}><Trash2 /></Button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor={`review-name-${i}`}>Nama pelanggan</Label><Input id={`review-name-${i}`} value={item.name} onChange={e => update(i, { name: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor={`review-branch-${i}`}>Cabang</Label><select id={`review-branch-${i}`} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={item.branch} onChange={e => update(i, { branch: e.target.value })}><option value="">Pilih cabang</option>{branches.map(b => <option key={b.name}>{b.name}</option>)}</select></div>
      </div>
      <div className="space-y-2"><Label htmlFor={`review-text-${i}`}>Testimoni pelanggan</Label><Textarea id={`review-text-${i}`} rows={4} value={item.text} onChange={e => update(i, { text: e.target.value })} /></div>
      <div className="space-y-2"><Label htmlFor={`review-rating-${i}`}>Bintang</Label><select id={`review-rating-${i}`} className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={item.rating} onChange={e => update(i, { rating: Number(e.target.value) })}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} bintang</option>)}</select></div>
      <div className="space-y-2"><Label htmlFor={`review-source-${i}`}>Tautan ulasan asli Google Maps</Label><Input id={`review-source-${i}`} type="url" value={item.source} onChange={e => update(i, { source: e.target.value })} /></div>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 accent-primary" checked={item.consent} onChange={e => update(i, { consent: e.target.checked })} /><span>Pelanggan telah mengizinkan nama dan testimoninya ditampilkan di website.</span></label>
    </div>)}
    <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => setItems([...items, { name: "", branch: branches[0]?.name ?? "", text: "", rating: 5, source: "", consent: false }])} disabled={saving}><Plus />Tambah Testimoni</Button><Button onClick={submit} disabled={saving}><Save />{saving ? "Menyimpan…" : "Simpan Testimoni"}</Button></div>
  </section>;
}