import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Mail, Phone, Smartphone, Menu, X, ArrowUpRight, MessageCircle, Clock } from "lucide-react";
import logo from "@/assets/icare-logo-primary-black.png";
import { waLink } from "@/lib/content";
import { useSiteContent } from "@/lib/content-context";

const nav = [
  { to: "/", label: "Beranda" },
  { to: "/tentang-icare", label: "Tentang" },
  { to: "/layanan", label: "Layanan" },
  { to: "/pricelist", label: "Pricelist" },
  { to: "/review", label: "Review" },
  { to: "/galeri", label: "Galeri" },
  { to: "/lokasi-kontak", label: "Lokasi" },
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center">
      <span className={light ? "rounded-md bg-white px-2 py-1" : ""}>
        <img src={logo} alt="iCare Apple Service Specialist" className="h-14 w-auto max-w-[160px] object-contain" />
      </span>
    </Link>
  );
}

export function WaButton({ children = "Konsultasi via WhatsApp", service, className = "", light = false }: { children?: ReactNode; service?: string; className?: string; light?: boolean }) {
  const { general } = useSiteContent();
  return (
    <a href={waLink(general, service)} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition hover:brightness-110 ${light ? "bg-background text-primary" : "bg-primary text-primary-foreground"} ${className}`}>
      {children} <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-border bg-accent px-3 py-1 font-display text-sm font-semibold uppercase tracking-wide text-accent-foreground">
      <Smartphone className="h-4 w-4" /> {children}
    </span>
  );
}

export function PageHero({ title, crumb }: { title: string; crumb: string }) {
  return (
    <section className="bg-ink pb-20 pt-44 text-center text-ink-foreground">
      <h1 className="text-5xl font-bold md:text-6xl">{title}</h1>
      <p className="mt-4 text-sm opacity-70">Beranda / <span className="text-primary">{crumb}</span></p>
    </section>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { general } = useSiteContent();
  return (
    <div className="min-h-screen">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="bg-primary pb-12 text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 py-3 text-sm font-medium">
            <a href={waLink(general)} className="flex items-center gap-2"><Phone className="h-4 w-4" />{general.waDisplay}</a>
            <a href={`mailto:${general.email}`} className="hidden items-center gap-2 sm:flex"><Mail className="h-4 w-4" />{general.email}</a>
            <span className="ml-auto hidden items-center gap-2 md:flex"><Clock className="h-4 w-4" />{general.hours}</span>
          </div>
        </div>
        <div className="mx-auto -mt-10 max-w-7xl px-4">
          <div className="flex items-center justify-between rounded-full bg-background px-5 py-3 shadow-lg md:px-8">
            <Logo />
            <nav className="hidden items-center gap-5 lg:flex">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
                  className="font-medium text-foreground transition hover:text-primary"
                  activeProps={{ className: "text-primary" }}>{n.label}</Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <WaButton className="px-4 py-2 text-sm md:px-6 md:py-3 md:text-base">Konsultasi</WaButton>
              <button aria-label="Menu" className="grid h-11 w-11 place-items-center rounded-full border border-border" onClick={() => setOpen(!open)}>
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          {open && (
            <div className="mt-2 rounded-2xl bg-background p-4 shadow-lg lg:hidden">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-3 font-medium">{n.label}</Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm opacity-70">
              Layanan servis independen untuk iPhone dan produk Apple lainnya sesuai kemampuan layanan. Bagian dari Putra Mahkota Group. Tidak berafiliasi dengan Apple Inc.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Menu</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-primary">{n.label}</Link></li>)}
              <li><Link to="/kebijakan-privasi" className="hover:text-primary">Kebijakan Privasi</Link></li>
              <li><Link to="/auth" className="hover:text-primary">Login Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Kontak</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li>WhatsApp {general.waDisplay}</li>
              <li>{general.email}</li>
              <li>{general.hours}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-foreground/10 py-5 text-center text-xs opacity-60">
          © {new Date().getFullYear()} iCare Service · Putra Mahkota Group
        </div>
      </footer>

      <a href={waLink(general)} target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-primary-foreground shadow-xl transition hover:scale-105">
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
