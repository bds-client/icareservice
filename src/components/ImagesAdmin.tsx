import { useState } from "react";
import { useQuery, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { resizeImage, validateImageFile } from "@/lib/image-resize";
import { galleryQuery } from "@/lib/gallery";
import { listSiteUploads } from "@/lib/images.functions";
import { ASSET_IMAGE_LABELS, ASSET_IMAGES } from "@/lib/images";
import type { ImagesContent } from "@/lib/image-refs";
import type { SiteContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Option {
  ref: string;
  label: string;
  url: string;
}

function useImageOptions(): Option[] {
  const { data: photos } = useSuspenseQuery(galleryQuery);
  const { data: uploads } = useQuery({ queryKey: ["site-uploads"], queryFn: () => listSiteUploads(), staleTime: 60_000 });
  const assets: Option[] = Object.entries(ASSET_IMAGES).map(([key, url]) => ({
    ref: `asset:${key}`,
    label: ASSET_IMAGE_LABELS[`asset:${key}`] ?? key,
    url,
  }));
  const gallery: Option[] = photos.map((p) => ({ ref: `gallery:${p.path}`, label: `Galeri: ${p.title}`, url: p.url }));
  const site: Option[] = (uploads ?? []).map((u) => ({ ref: u.path.startsWith("site:") ? u.path : `site:${u.path.replace(/^site\//, "")}`, label: `Unggahan: ${u.path.split("/").pop()}`, url: u.url }));
  return [...assets, ...gallery, ...site];
}

function SlotPicker({
  label,
  value,
  options,
  onChange,
  onUpload,
  busy,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (ref: string) => void;
  onUpload: (file: File, apply: (ref: string) => void) => void;
  busy: boolean;
}) {
  const current = options.find((o) => o.ref === value);
  const [inputKey, setInputKey] = useState(0);
  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <Label>{label}</Label>
      {current?.url && <img src={current.url} alt={label} className="aspect-[4/3] w-full max-w-xs rounded-lg object-cover" loading="lazy" />}
      <select
        value={value}
        disabled={busy}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        {!current && <option value={value}>Foto saat ini</option>}
        {options.map((o) => (
          <option key={o.ref} value={o.ref}>{o.label}</option>
        ))}
      </select>
      <div className="flex items-center gap-3">
        <Input
          key={inputKey}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          className="max-w-xs"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file, onChange);
            setInputKey((k) => k + 1);
          }}
        />
      </div>
    </div>
  );
}

export function ImagesAdmin({ content, save }: { content: SiteContent; save: (key: "images", value: ImagesContent) => Promise<void> }) {
  const options = useImageOptions();
  const qc = useQueryClient();
  const [v, setV] = useState<ImagesContent>(content.images);
  const [busy, setBusy] = useState(false);

  async function upload(file: File, apply: (ref: string) => void) {
    if (busy) return;
    setBusy(true);
    try {
      validateImageFile(file);
      const resized = await resizeImage(file);
      const extension = resized.type === "image/png" ? "png" : resized.type === "image/webp" ? "webp" : "jpg";
      const name = `${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("gallery").upload(`site/${name}`, resized, { contentType: resized.type });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["site-uploads"] });
      apply(`site:${name}`);
      toast.success("Foto diunggah dan dipilih. Klik Simpan untuk menerapkan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengunggah foto.");
    } finally {
      setBusy(false);
    }
  }

  const setService = (i: number, ref: string) => {
    const next = v.services.slice();
    next[i] = ref;
    setV({ ...v, services: next });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Foto Website</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ganti foto beranda, foto tentang, dan foto layanan. Pilih foto yang sudah ada atau unggah foto baru, lalu klik Simpan.
          Foto yang diunggah di sini tidak otomatis tampil di halaman Galeri.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SlotPicker label="Foto Beranda (hero)" value={v.hero} options={options} busy={busy} onChange={(ref) => setV({ ...v, hero: ref })} onUpload={upload} />
          <SlotPicker label="Foto Tentang" value={v.about} options={options} busy={busy} onChange={(ref) => setV({ ...v, about: ref })} onUpload={upload} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Foto Layanan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Foto layanan dipakai berurutan sesuai daftar layanan; jika layanan lebih banyak, foto dipakai berulang.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {v.services.map((ref, i) => (
            <div key={i} className="relative">
              <SlotPicker label={`Foto layanan ${i + 1}`} value={ref} options={options} busy={busy} onChange={(r) => setService(i, r)} onUpload={upload} />
              {v.services.length > 1 && (
                <button
                  type="button"
                  aria-label="Hapus foto layanan"
                  onClick={() => setV({ ...v, services: v.services.filter((_, j) => j !== i) })}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="outline" disabled={busy || v.services.length >= 20} onClick={() => setV({ ...v, services: [...v.services, "asset:svc-diag"] })}>
            <Plus className="mr-2 h-4 w-4" /> Tambah foto layanan
          </Button>
          <Button disabled={busy} onClick={() => save("images", v)}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Simpan
          </Button>
        </div>
      </div>
    </section>
  );
}
