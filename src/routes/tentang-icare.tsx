import { createFileRoute } from "@tanstack/react-router";
import { Eye, HandHeart, MessagesSquare, Wrench, type LucideIcon } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { CtaBand, Eyebrow } from "@/components/Sections";
import { useSiteContent } from "@/lib/content-context";
import { useSiteImages } from "@/lib/images";

export const Route = createFileRoute("/tentang-icare")({
  head: () => ({
    meta: [
      { title: "Tentang iCare Service | Putra Mahkota Group" },
      { name: "description", content: "Profil iCare Service, layanan servis independen dari Putra Mahkota Group sejak 1998." },
      { property: "og:title", content: "Tentang iCare Service" },
      { property: "og:description", content: "Profil, visi, misi, dan prinsip layanan iCare Service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const principleIcons: LucideIcon[] = [Eye, Wrench, MessagesSquare, HandHeart];

function About() {
  const { tentang: t } = useSiteContent();
  const images = useSiteImages();
  return (
    <SiteLayout>
      <PageHero title={t.pageTitle} crumb={t.pageCrumb} />
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 lg:grid-cols-2">
        <img src={images.about} alt="Tim iCare Service" loading="lazy" width={1200} height={1008} className="rounded-3xl shadow-xl" />
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">{t.title}</h2>
          <p className="mt-5 text-muted-foreground">{t.body}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-6"><h3 className="text-2xl font-semibold text-primary">Visi</h3><p className="mt-2 text-sm text-muted-foreground">{t.vision}</p></div>
            <div className="rounded-2xl bg-secondary p-6"><h3 className="text-2xl font-semibold text-primary">Misi</h3><p className="mt-2 text-sm text-muted-foreground">{t.mission}</p></div>
          </div>
        </div>
      </section>
      <section className="bg-ink py-24 text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-4xl font-bold md:text-5xl">{t.principlesTitle}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {t.principles.map(({ t: pt, d }, i) => {
              const I = principleIcons[i % principleIcons.length] ?? Eye;
              return (
                <div key={pt} className="rounded-2xl border border-ink-foreground/10 p-6">
                  <I className="h-10 w-10 text-primary" />
                  <h3 className="mt-4 text-xl font-semibold">{pt}</h3>
                  <p className="mt-2 text-sm opacity-70">{d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBand />
    </SiteLayout>
  );
}