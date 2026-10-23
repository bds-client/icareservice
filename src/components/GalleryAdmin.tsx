import { useState } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { resizeImage, validateImageFile } from "@/lib/image-resize";
import { galleryQuery } from "@/lib/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GalleryAdmin() {
  const { data: photos } = useSuspenseQuery(galleryQuery);
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || busy) return;
    setBusy(true);
    try {
      validateImageFile(file);
      const resized = await resizeImage(file);
      const extension = resized.type === "image/png" ? "png" : resized.type === "image/webp" ? "webp" : "jpg";
      const path = `${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, resized, { contentType: resized.type });
      if (uploadError) throw uploadError;
      const { error } = await supabase.from("gallery_photos").insert({ path, title: title.trim() || file.name.replace(/\.[^.]+$/, "") });
      if (error) {
        await supabase.storage.from("gallery").remove([path]);
        throw error;
      }
      await qc.invalidateQueries({ queryKey: ["gallery"] });
      setFile(null); setTitle(""); setInputKey((key) => key + 1);
      toast.success("Foto ditambahkan ke galeri website.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Gagal menambah foto."); }
    finally { setBusy(false); }
  }
  async function remove(photo: typeof photos[number]) {
    if (!window.confirm(`Hapus foto “${photo.title}”?`)) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);
      if (error) throw error;
      const { error: storageError } = await supabase.storage.from("gallery").remove([photo.path]);
      await qc.invalidateQueries({ queryKey: ["gallery"] });
      if (storageError) toast.error("Foto tidak lagi tampil, tetapi berkas belum berhasil dibersihkan.");
      else toast.success("Foto dihapus.");
    } catch { toast.error("Foto belum berhasil dihapus."); }
    finally { setBusy(false); }
  }
  return <section className="space-y-8">
    <h2 className="text-2xl font-semibold">Galeri Foto</h2>
    <form onSubmit={upload} className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
      <div className="space-y-2"><Label htmlFor="gallery-photo">Foto</Label><Input key={inputKey} id="gallery-photo" type="file" accept="image/jpeg,image/png,image/webp" required disabled={busy} onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
      <div className="space-y-2"><Label htmlFor="gallery-title">Judul foto</Label><Input id="gallery-title" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} disabled={busy} /></div>
      <Button type="submit" disabled={busy || !file}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Tambah Foto</Button>
    </form>
    {photos.length === 0 ? <p className="py-12 text-center text-muted-foreground">Belum ada foto.</p> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{photos.map((photo) => <article key={photo.id} className="overflow-hidden rounded-lg border border-border bg-card">
      <img src={photo.url} alt={photo.title} className="aspect-[4/3] w-full object-cover" />
      <div className="flex items-center gap-3 p-4"><p className="min-w-0 flex-1 break-words font-medium">{photo.title}</p><Button variant="outline" size="icon" aria-label={`Hapus ${photo.title}`} title="Hapus foto" disabled={busy} onClick={() => remove(photo)}><Trash2 className="h-4 w-4" /></Button></div>
    </article>)}</div>}
  </section>;
}