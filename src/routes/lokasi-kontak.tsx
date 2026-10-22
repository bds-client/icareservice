import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { PageHero, SiteLayout, WaButton } from "@/components/SiteLayout";
import { BranchCards } from "@/components/Sections";
import { EMAIL, HOURS, WA_DISPLAY } from "@/lib/site";

export const Route = createFileRoute("/lokasi-kontak")({
  head: () => ({
    meta: [
      { title: "Lokasi & Kontak | iCare Service Teuku Umar Denpasar" },
      { name: "description", content: "Alamat dua cabang iCare Service di Jl. Teuku Umar Denpasar, jam buka, WhatsApp, dan email." },
      { property: "og:title", content: "Lokasi & Kontak iCare Service" },
      { property: "og:description", content: "Dua cabang di Jl. Teuku Umar, Denpasar. Buka setiap hari 09.00–22.00 WITA." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const items = [
    { icon: MessageCircle, t: "WhatsApp", v: WA_DISPLAY },
    { icon: Mail, t: "Email", v: EMAIL },
    { icon: Clock, t: "Jam Operasional", v: HOURS },
  ];
  return (
    <SiteLayout>
      <PageHero title="Lokasi & Kontak" crumb="Lokasi" />
      <section className="mx-auto max-w-7xl px-4 py-24">
        <BranchCards />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: I, t, v }) => (
            <div key={t} className="flex items-center gap-4 rounded-2xl bg-secondary p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"><I className="h-5 w-5" /></span>
              <div><p className="text-sm text-muted-foreground">{t}</p><p className="font-semibold">{v}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center"><WaButton /></div>
      </section>
    </SiteLayout>
  );
}
