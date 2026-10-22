import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/SiteLayout";
import { EMAIL } from "@/lib/site";

export const Route = createFileRoute("/kebijakan-privasi")({
  head: () => ({
    meta: [
      { title: "Kebijakan Privasi | iCare Service" },
      { name: "description", content: "Penjelasan pengumpulan dan penggunaan data di website iCare Service." },
      { property: "og:title", content: "Kebijakan Privasi iCare Service" },
      { property: "og:description", content: "Bagaimana iCare Service mengelola data pengunjung." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <SiteLayout>
      <PageHero title="Kebijakan Privasi" crumb="Kebijakan Privasi" />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-24 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">Data yang kami kumpulkan</h2>
        <p>Website ini tidak meminta data pribadi secara langsung. Saat Anda menghubungi kami melalui WhatsApp atau email, informasi yang Anda kirim digunakan hanya untuk menanggapi pertanyaan servis.</p>
        <h2 className="text-2xl font-semibold text-foreground">Layanan pihak ketiga</h2>
        <p>Website ini menautkan ke WhatsApp dan Google Maps. Penggunaan layanan tersebut tunduk pada kebijakan privasi masing-masing penyedia. Jika analitik diaktifkan, data kunjungan anonim dapat digunakan untuk meningkatkan website.</p>
        <h2 className="text-2xl font-semibold text-foreground">Kontak</h2>
        <p>Pertanyaan tentang privasi dapat dikirim ke {EMAIL}.</p>
      </section>
    </SiteLayout>
  );
}
