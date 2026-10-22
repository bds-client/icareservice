import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck, Eye, HandHeart, ShieldCheck, Wrench } from "lucide-react";
import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import { SiteLayout, WaButton } from "@/components/SiteLayout";
import { BranchCards, CtaBand, Eyebrow, ReviewSources, ServicesGrid } from "@/components/Sections";
import { useSiteContent } from "@/lib/content-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Servis iPhone Denpasar | iCare Service" },
      { name: "description", content: "iCare Service membantu Anda memahami pilihan penanganan, kualitas sparepart, dan biaya sebelum servis iPhone di Denpasar." },
      { property: "og:title", content: "Servis iPhone Denpasar | iCare Service" },
      { property: "og:description", content: "Servis iPhone dengan pilihan yang jelas dan transparan di Denpasar, Bali." },
    ],
  }),
  component: Index,
});

const trustIcons = [BadgeCheck, Eye, Wrench, HandHeart];

function Index() {
  const { hero: h, trust, about: a, general } = useSiteContent();
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Teknisi iCare memperbaiki iPhone" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-24 pt-48 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="text-ink-foreground">
            <h1 className="text-5xl font-bold leading-[1.05] md:text-7xl">{h.title}</h1>
            <p className="mt-6 max-w-xl text-lg opacity-80">{h.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4 border-t border-ink-foreground/20 pt-8">
              <WaButton />
              <Link to="/lokasi-kontak" className="inline-flex items-center gap-2 rounded-full border-2 border-ink-foreground/60 px-6 py-3 font-semibold transition hover:bg-ink-foreground hover:text-ink">
                Lihat Lokasi Cabang <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-ink-foreground">
            <div className="glass col-span-2 rounded-2xl p-6">
              <p className="font-display text-xl font-semibold">2 Cabang di Denpasar</p>
              <p className="mt-1 text-sm opacity-80">{h.branchesLine}</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <p className="font-display text-5xl font-bold text-primary">{h.stat1Value}</p>
              <p className="font-display text-lg">{h.stat1Label}</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <p className="font-display text-5xl font-bold text-primary">{h.stat2Value}</p>
              <p className="font-display text-lg">{h.stat2Label}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-7xl px-4 relative z-10">
        <div className="grid gap-px overflow-hidden rounded-2xl bg-border shadow-xl sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(({ t, d }, i) => {
            const I = trustIcons[i % trustIcons.length];
            return (
              <div key={t} className="flex gap-4 bg-card p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-primary"><I className="h-6 w-6" /></span>
                <div><p className="font-display text-xl font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 lg:grid-cols-2">
        <div>
          <Eyebrow>Tentang Kami</Eyebrow>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">{a.title}</h2>
          <p className="mt-5 text-muted-foreground">{a.body}</p>
          <ul className="mt-6 space-y-3">
            {a.points.map((x) => (
              <li key={x} className="flex gap-3"><ShieldCheck className="h-5 w-5 text-primary" />{x}</li>
            ))}
          </ul>
          <Link to="/tentang-icare" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary">Selengkapnya <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <img src={about} alt="Staf iCare menjelaskan pilihan servis" loading="lazy" width={1200} height={1008} className="rounded-3xl object-cover shadow-xl" />
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center"><Eyebrow>Layanan</Eyebrow><h2 className="mt-4 text-4xl font-bold md:text-5xl">Layanan yang Kami Tangani</h2></div>
          <ServicesGrid />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="mb-12 text-center"><Eyebrow>Review</Eyebrow><h2 className="mt-4 text-4xl font-bold md:text-5xl">Apa Kata Pelanggan</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Kami menampilkan ulasan langsung dari sumber aslinya di Google Maps.</p></div>
        <ReviewSources />
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center"><Eyebrow>Lokasi</Eyebrow><h2 className="mt-4 text-4xl font-bold md:text-5xl">Dua Cabang di Denpasar</h2></div>
          <BranchCards />
        </div>
      </section>

      <CtaBand />
      <span className="sr-only">{general.hours}</span>
    </SiteLayout>
  );
}
