import { createFileRoute } from "@tanstack/react-router";
import { Eye, HandHeart, MessagesSquare, Wrench } from "lucide-react";
import about from "@/assets/about.jpg";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { CtaBand, Eyebrow } from "@/components/Sections";

export const Route = createFileRoute("/tentang-icare")({
  head: () => ({
    meta: [
      { title: "Tentang iCare Service | Putra Mahkota Group" },
      { name: "description", content: "Profil iCare Service, layanan servis independen dari Putra Mahkota Group sejak 1998." },
      { property: "og:title", content: "Tentang iCare Service" },
      { property: "og:description", content: "Profil, visi, misi, dan prinsip layanan iCare Service." },
    ],
  }),
  component: About,
});

const principles = [
  { icon: Eye, t: "Transparansi", d: "Pilihan penanganan, kualitas sparepart, dan biaya dijelaskan sebelum pengerjaan." },
  { icon: Wrench, t: "Penanganan Cermat", d: "Setiap perangkat ditangani dengan teliti dan hati-hati." },
  { icon: MessagesSquare, t: "Komunikasi", d: "Kami memberi kabar selama proses servis berlangsung." },
  { icon: HandHeart, t: "Dukungan Pascaservis", d: "Bantuan setelah servis sesuai ketentuan yang berlaku." },
];

function About() {
  return (
    <SiteLayout>
      <PageHero title="Tentang iCare" crumb="Tentang" />
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 lg:grid-cols-2">
        <img src={about} alt="Tim iCare Service" loading="lazy" width={1200} height={1008} className="rounded-3xl shadow-xl" />
        <div>
          <Eyebrow>Profil</Eyebrow>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Layanan servis independen dari Putra Mahkota Group</h2>
          <p className="mt-5 text-muted-foreground">iCare Service adalah layanan servis independen yang berfokus pada iPhone dan produk Apple lainnya sesuai kemampuan layanan. Brand iCare dikembangkan dari Putra Mahkota Group yang telah berdiri sejak 1998.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-6"><h3 className="text-2xl font-semibold text-primary">Visi</h3><p className="mt-2 text-sm text-muted-foreground">Menjadi tempat servis perangkat yang dipercaya karena kejelasan dan kualitas layanannya.</p></div>
            <div className="rounded-2xl bg-secondary p-6"><h3 className="text-2xl font-semibold text-primary">Misi</h3><p className="mt-2 text-sm text-muted-foreground">Memberikan informasi yang terbuka, penanganan yang cermat, dan dukungan setelah servis.</p></div>
          </div>
        </div>
      </section>
      <section className="bg-ink py-24 text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-4xl font-bold md:text-5xl">Prinsip Layanan Kami</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {principles.map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-2xl border border-ink-foreground/10 p-6">
                <I className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm opacity-70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </SiteLayout>
  );
}
