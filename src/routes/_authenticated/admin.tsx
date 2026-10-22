import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Plus, Save, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/lib/content-context";
import type { ContentKey, SiteContent } from "@/lib/content";
import {
  createTeamUser,
  deleteTeamUser,
  getMyRoles,
  listTeam,
  saveSection,
  setTeamRole,
} from "@/lib/content.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "CMS Admin | iCare Service" }] }),
  component: Admin,
});

function useSaver() {
  const save = useServerFn(saveSection);
  const qc = useQueryClient();
  return async (key: ContentKey, value: unknown) => {
    try {
      await save({ data: { key, value } });
      await qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Perubahan tersimpan dan langsung tampil di website.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    }
  };
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {multiline ? (
        <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ListEditor<T extends object>({
  items,
  fields,
  onChange,
  addLabel,
}: {
  items: T[];
  fields: { key: keyof T & string; label: string; multiline?: boolean }[];
  onChange: (items: T[]) => void;
  addLabel: string;
}) {
  const update = (i: number, k: string, v: string) => {
    const next = items.slice();
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="relative space-y-3 rounded-xl border border-border p-4">
          <button
            type="button"
            aria-label="Hapus"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {fields.map((f) => (
            <Field key={f.key} label={f.label} value={(item as Record<string, string>)[f.key] ?? ""} multiline={f.multiline ?? false} onChange={(v) => update(i, f.key, v)} />
          ))}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, ""])) as T])}
      >
        <Plus className="mr-2 h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}

function SectionCard({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
      <Button className="mt-6" onClick={onSave}>
        <Save className="mr-2 h-4 w-4" /> Simpan
      </Button>
    </div>
  );
}

function GeneralForm({ content, save }: { content: SiteContent; save: ReturnType<typeof useSaver> }) {
  const [v, setV] = useState(content.general);
  return (
    <SectionCard title="Kontak & Jam Operasional" onSave={() => save("general", v)}>
      <Field label="Nomor WhatsApp (format 62…)" value={v.waNumber} onChange={(x) => setV({ ...v, waNumber: x })} />
      <Field label="Nomor WhatsApp (tampilan)" value={v.waDisplay} onChange={(x) => setV({ ...v, waDisplay: x })} />
      <Field label="Email" value={v.email} onChange={(x) => setV({ ...v, email: x })} />
      <Field label="Jam operasional" value={v.hours} onChange={(x) => setV({ ...v, hours: x })} />
    </SectionCard>
  );
}

function HeroForm({ content, save }: { content: SiteContent; save: ReturnType<typeof useSaver> }) {
  const [v, setV] = useState(content.hero);
  return (
    <SectionCard title="Bagian Atas Beranda (Hero)" onSave={() => save("hero", v)}>
      <Field label="Judul besar" value={v.title} onChange={(x) => setV({ ...v, title: x })} multiline />
      <Field label="Deskripsi" value={v.subtitle} onChange={(x) => setV({ ...v, subtitle: x })} multiline />
      <Field label="Baris info cabang" value={v.branchesLine} onChange={(x) => setV({ ...v, branchesLine: x })} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Statistik 1 (angka)" value={v.stat1Value} onChange={(x) => setV({ ...v, stat1Value: x })} />
        <Field label="Statistik 1 (label)" value={v.stat1Label} onChange={(x) => setV({ ...v, stat1Label: x })} />
        <Field label="Statistik 2 (angka)" value={v.stat2Value} onChange={(x) => setV({ ...v, stat2Value: x })} />
        <Field label="Statistik 2 (label)" value={v.stat2Label} onChange={(x) => setV({ ...v, stat2Label: x })} />
      </div>
    </SectionCard>
  );
}

function TrustForm({ content, save }: { content: SiteContent; save: ReturnType<typeof useSaver> }) {
  const [v, setV] = useState(content.trust);
  return (
    <SectionCard title="Poin Kepercayaan (Beranda)" onSave={() => save("trust", v)}>
      <ListEditor
        items={v}
        fields={[
          { key: "t", label: "Judul" },
          { key: "d", label: "Deskripsi" },
        ]}
        onChange={(x) => setV(x as unknown as typeof v)}
        addLabel="Tambah poin"
      />
    </SectionCard>
  );
}

function AboutForm({ content, save }: { content: SiteContent; save: ReturnType<typeof useSaver> }) {
  const [v, setV] = useState(content.about);
  return (
    <SectionCard title="Tentang Kami (Beranda)" onSave={() => save("about", v)}>
      <Field label="Judul" value={v.title} onChange={(x) => setV({ ...v, title: x })} multiline />
      <Field label="Isi" value={v.body} onChange={(x) => setV({ ...v, body: x })} multiline />
      <div className="space-y-2">
        <Label>Poin-poin (satu per baris)</Label>
        <Textarea rows={4} value={v.points.join("\n")} onChange={(e) => setV({ ...v, points: e.target.value.split("\n").filter(Boolean) })} />
      </div>
    </SectionCard>
  );
}

function ServicesForm({ content, save }: { content: SiteContent; save: ReturnType<typeof useSaver> }) {
  const [v, setV] = useState(content.services);
  return (
    <SectionCard title="Layanan" onSave={() => save("services", v)}>
      <ListEditor
        items={v}
        fields={[
          { key: "name", label: "Nama layanan" },
          { key: "desc", label: "Deskripsi", multiline: true },
        ]}
        onChange={(x) => setV(x as unknown as typeof v)}
        addLabel="Tambah layanan"
      />
      <p className="text-sm text-muted-foreground">Foto layanan mengikuti urutan: diagnosis, layar, baterai.</p>
    </SectionCard>
  );
}

function FeesForm({ content, save }: { content: SiteContent; save: ReturnType<typeof useSaver> }) {
  const [fees, setFees] = useState(content.serviceFees);
  const [parts, setParts] = useState(content.sparepartPrices);
  return (
    <div className="space-y-6">
      <SectionCard title="Biaya Jasa Servis" onSave={() => save("serviceFees", fees)}>
        <ListEditor
          items={fees}
          fields={[
            { key: "name", label: "Jasa" },
            { key: "price", label: "Harga" },
          ]}
          onChange={(x) => setFees(x as unknown as typeof fees)}
          addLabel="Tambah jasa"
        />
      </SectionCard>
      <SectionCard title="Harga Sparepart" onSave={() => save("sparepartPrices", parts)}>
        <ListEditor
          items={parts}
          fields={[
            { key: "part", label: "Sparepart" },
            { key: "price", label: "Harga" },
          ]}
          onChange={(x) => setParts(x as unknown as typeof parts)}
          addLabel="Tambah sparepart"
        />
      </SectionCard>
    </div>
  );
}

function BranchesForm({ content, save }: { content: SiteContent; save: ReturnType<typeof useSaver> }) {
  const [v, setV] = useState(content.branches);
  return (
    <SectionCard title="Cabang" onSave={() => save("branches", v)}>
      <ListEditor
        items={v}
        fields={[
          { key: "name", label: "Nama cabang" },
          { key: "address", label: "Alamat", multiline: true },
          { key: "maps", label: "Link Google Maps" },
        ]}
        onChange={(x) => setV(x as unknown as typeof v)}
        addLabel="Tambah cabang"
      />
    </SectionCard>
  );
}

function CtaForm({ content, save }: { content: SiteContent; save: ReturnType<typeof useSaver> }) {
  const [v, setV] = useState(content.cta);
  return (
    <SectionCard title="Banner Ajakan (CTA)" onSave={() => save("cta", v)}>
      <Field label="Judul" value={v.title} onChange={(x) => setV({ ...v, title: x })} />
      <Field label="Isi" value={v.body} onChange={(x) => setV({ ...v, body: x })} multiline />
    </SectionCard>
  );
}

function TeamPanel() {
  const qc = useQueryClient();
  const { data: team } = useQuery({ queryKey: ["team"], queryFn: () => listTeam() });
  const createUser = useServerFn(createTeamUser);
  const toggleRole = useServerFn(setTeamRole);
  const removeUser = useServerFn(deleteTeamUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createUser({ data: { email, password, role } });
      toast.success(`Akun ${email} dibuat sebagai ${role}.`);
      setEmail("");
      setPassword("");
      qc.invalidateQueries({ queryKey: ["team"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat akun");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Tambah Admin / Staff</h2>
        <form onSubmit={handleCreate} className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto]">
          <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "staff")}
            className="rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" /> Buat
          </Button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">
          Staff bisa mengedit konten. Admin bisa mengedit konten dan mengelola akun.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Daftar Akun</h2>
        <ul className="mt-5 divide-y divide-border">
          {(team ?? []).map((u) => (
            <li key={u.id} className="flex flex-wrap items-center gap-4 py-4">
              <span className="min-w-0 flex-1 truncate font-medium">{u.email}</span>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={u.roles.includes("staff")}
                  onCheckedChange={async (on) => {
                    await toggleRole({ data: { userId: u.id, role: "staff", enabled: on } });
                    qc.invalidateQueries({ queryKey: ["team"] });
                  }}
                />
                Staff
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={u.roles.includes("admin")}
                  onCheckedChange={async (on) => {
                    await toggleRole({ data: { userId: u.id, role: "admin", enabled: on } });
                    qc.invalidateQueries({ queryKey: ["team"] });
                  }}
                />
                Admin
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await removeUser({ data: { userId: u.id } });
                    toast.success("Akun dihapus.");
                    qc.invalidateQueries({ queryKey: ["team"] });
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Gagal menghapus");
                  }
                }}
              >
                <Trash2 className="mr-1 h-4 w-4" /> Hapus
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Admin() {
  const content = useSiteContent();
  const save = useSaver();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: roles } = useQuery({ queryKey: ["my-roles"], queryFn: () => getMyRoles() });
  const isAdmin = (roles ?? []).includes("admin");

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-2xl font-bold">
            iCare<span className="text-primary"> CMS</span>
          </h1>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
              Lihat Website
            </a>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Tabs defaultValue="umum">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="umum">Umum</TabsTrigger>
            <TabsTrigger value="beranda">Beranda</TabsTrigger>
            <TabsTrigger value="layanan">Layanan</TabsTrigger>
            <TabsTrigger value="harga">Harga</TabsTrigger>
            <TabsTrigger value="cabang">Cabang</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="tim">
                <Users className="mr-1 h-4 w-4" /> Tim
              </TabsTrigger>
            )}
          </TabsList>
          <div className="mt-6 space-y-6">
            <TabsContent value="umum" className="space-y-6">
              <GeneralForm content={content} save={save} />
              <CtaForm content={content} save={save} />
            </TabsContent>
            <TabsContent value="beranda" className="space-y-6">
              <HeroForm content={content} save={save} />
              <TrustForm content={content} save={save} />
              <AboutForm content={content} save={save} />
            </TabsContent>
            <TabsContent value="layanan">
              <ServicesForm content={content} save={save} />
            </TabsContent>
            <TabsContent value="harga">
              <FeesForm content={content} save={save} />
            </TabsContent>
            <TabsContent value="cabang">
              <BranchesForm content={content} save={save} />
            </TabsContent>
            {isAdmin && (
              <TabsContent value="tim">
                <TeamPanel />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
