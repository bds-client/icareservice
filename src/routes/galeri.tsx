import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Images } from "lucide-react";
import { galleryQuery } from "@/lib/gallery";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/galeri")({
  head: () => ({ meta: [
    { title: "Galeri Foto | iCare Service Denpasar" },
    { name: "description", content: "Galeri foto iCare Service Denpasar: dokumentasi layanan dan aktivitas kami." },
    { property: "og:title", content: "Galeri Foto iCare Service" },
    { property: "og:description", content: "Dokumentasi foto iCare Service Denpasar." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery),
  component: Gallery,
});

function Gallery() {
  const { data: photos } = useSuspenseQuery(galleryQuery);
  const [selected, setSelected] = useState<typeof photos[number] | null>(null);
  return <SiteLayout>
    <PageHero title="Galeri iCare Service" crumb="Galeri" />
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      {photos.length === 0 ? <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-muted-foreground"><Images className="h-10 w-10" /><p>Belum ada foto di galeri.</p></div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{photos.map((photo) => <figure key={photo.id} className="min-w-0">
        <Button variant="ghost" className="block h-auto w-full overflow-hidden rounded-lg p-0" aria-label={`Lihat foto ${photo.title}`} onClick={() => setSelected(photo)}><img src={photo.url} alt={photo.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-300 motion-safe:hover:scale-105" /></Button>
        <figcaption className="mt-3 break-words font-medium">{photo.title}</figcaption>
      </figure>)}</div>}
    </section>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="max-w-4xl"><DialogTitle className="break-words pr-6">{selected?.title}</DialogTitle>{selected && <img src={selected.url} alt={selected.title} className="max-h-[70vh] w-full object-contain" />}</DialogContent></Dialog>
  </SiteLayout>;
}