import { ArrowUpRight, Clock, MapPin, Star, MessageSquareQuote, Wrench, Cpu } from "lucide-react";
import { useSiteContent } from "@/lib/content-context";
import { useSiteImages } from "@/lib/images";
import { Eyebrow, WaButton } from "./SiteLayout";

export function ServicesGrid() {
  const { services } = useSiteContent();
  const images = useSiteImages();
  const serviceImages = images.services.length ? images.services : [""];
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {services.map((s, i) => (
        <article key={s.name} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
          <div className="overflow-hidden">
            <img src={serviceImages[i % serviceImages.length]} alt={s.name} loading="lazy" width={944} height={704} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-semibold">{s.name}</h3>
            <p className="mt-2 text-muted-foreground">{s.desc}</p>
            <WaButton service={s.name} className="mt-5 px-5 py-2 text-sm">Tanyakan Layanan</WaButton>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PriceTables() {
  const { serviceFees, sparepartPrices } = useSiteContent();
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-3 bg-ink p-6 text-ink-foreground">
          <Wrench className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-semibold">Biaya Jasa Servis</h3>
        </div>
        <ul className="divide-y divide-border">
          {serviceFees.map((f) => (
            <li key={f.name} className="flex items-center justify-between gap-4 px-6 py-4">
              <span>{f.name}</span>
              <span className="font-display text-lg font-semibold text-primary">{f.price}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-3 bg-ink p-6 text-ink-foreground">
          <Cpu className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-semibold">Harga Sparepart</h3>
        </div>
        <ul className="divide-y divide-border">
          {sparepartPrices.map((p) => (
            <li key={p.part} className="flex items-center justify-between gap-4 px-6 py-4">
              <span>{p.part}</span>
              <span className="font-display text-lg font-semibold text-primary">{p.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BranchCards() {
  const { branches, general } = useSiteContent();
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {branches.map((b) => (
        <div key={b.name} className="rounded-2xl border border-border bg-card p-8">
          <h3 className="text-2xl font-semibold">{b.name}</h3>
          <p className="mt-4 flex gap-3 text-muted-foreground"><MapPin className="h-5 w-5 shrink-0 text-primary" />{b.address}</p>
          <p className="mt-3 flex gap-3 text-muted-foreground"><Clock className="h-5 w-5 shrink-0 text-primary" />{general.hours}</p>
          <a href={b.maps} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
            Petunjuk Arah <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      ))}
    </div>
  );
}

export function ReviewSources() {
  const { branches, testimonials } = useSiteContent();
  return (
    <div className="space-y-10">
      {testimonials.length > 0 && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((review, i) => <article key={`${review.name}-${i}`} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-6">
          <div className="flex gap-1 text-primary" aria-label={`${review.rating} dari 5 bintang`}>
            {[1,2,3,4,5].map(star => <Star key={star} className={`h-4 w-4 ${star <= review.rating ? "fill-current" : "text-muted-foreground"}`} />)}
          </div>
          <p className="mt-4 whitespace-pre-wrap break-words text-foreground">“{review.text}”</p>
          <div className="mt-auto pt-6">
            <h3 className="text-lg font-semibold break-words">{review.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground break-words">{review.branch}</p>
            <a href={review.source} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">Ulasan asli di Google Maps <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </article>)}
      </div>}
    <div className="grid gap-8 md:grid-cols-2">
      {branches.map((b) => (
        <a key={b.name} href={b.maps} target="_blank" rel="noopener noreferrer"
          className="group flex items-start gap-5 rounded-2xl bg-ink p-8 text-ink-foreground transition hover:-translate-y-1">
          <MessageSquareQuote className="h-10 w-10 shrink-0 text-primary" />
          <div>
            <div className="flex gap-1 text-primary">{[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4" />)}</div>
            <h3 className="mt-3 text-2xl font-semibold">{b.name}</h3>
            <p className="mt-2 text-sm opacity-70">Baca ulasan asli pelanggan langsung di Google Maps.</p>
            <span className="mt-4 inline-flex items-center gap-2 font-semibold text-primary">Lihat ulasan <ArrowUpRight className="h-4 w-4" /></span>
          </div>
        </a>
      ))}
    </div>
    </div>
  );
}

export function CtaBand() {
  const { cta } = useSiteContent();
  return (
    <section className="px-4 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-primary p-10 text-primary-foreground md:flex-row md:items-center md:p-14">
        <div>
          <h2 className="text-4xl font-bold md:text-5xl">{cta.title}</h2>
          <p className="mt-3 max-w-xl opacity-90">{cta.body}</p>
        </div>
        <WaButton light>Konsultasi via WhatsApp</WaButton>
      </div>
    </section>
  );
}

export { Eyebrow };
