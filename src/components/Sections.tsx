import { ArrowUpRight, Clock, MapPin, Star, MessageSquareQuote } from "lucide-react";
import { branches, HOURS, services } from "@/lib/site";
import { Eyebrow, WaButton } from "./SiteLayout";

export function ServicesGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {services.map((s) => (
        <article key={s.name} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
          <div className="overflow-hidden">
            <img src={s.img} alt={s.name} loading="lazy" width={944} height={704} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
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

export function BranchCards() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {branches.map((b) => (
        <div key={b.name} className="rounded-2xl border border-border bg-card p-8">
          <h3 className="text-2xl font-semibold">{b.name}</h3>
          <p className="mt-4 flex gap-3 text-muted-foreground"><MapPin className="h-5 w-5 shrink-0 text-primary" />{b.address}</p>
          <p className="mt-3 flex gap-3 text-muted-foreground"><Clock className="h-5 w-5 shrink-0 text-primary" />{HOURS}</p>
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
  return (
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
  );
}

export function CtaBand() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-primary p-10 text-primary-foreground md:flex-row md:items-center md:p-14">
        <div>
          <h2 className="text-4xl font-bold md:text-5xl">Perangkat bermasalah?</h2>
          <p className="mt-3 max-w-xl opacity-90">Ceritakan kendala Anda. Tim kami jelaskan pilihan penanganan, kualitas sparepart, dan biaya sebelum servis.</p>
        </div>
        <WaButton light>Konsultasi via WhatsApp</WaButton>
      </div>
    </section>
  );
}

export { Eyebrow };
