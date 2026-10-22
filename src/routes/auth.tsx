import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Masuk Admin | iCare Service" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMessage("Pendaftaran berhasil. Silakan cek email Anda untuk konfirmasi, lalu masuk.");
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Smartphone className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-bold">
            iCare<span className="text-primary"> Admin</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold">{mode === "login" ? "Masuk ke CMS" : "Daftar Akun"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Masuk untuk mengedit konten website."
            : "Pengguna pertama yang mendaftar otomatis menjadi admin."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {message && <p className="rounded-lg bg-accent p-3 text-sm text-accent-foreground">{message}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setMessage(null);
          }}
          className="mt-4 w-full text-center text-sm font-medium text-primary hover:underline"
        >
          {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
        </button>
      </div>
    </div>
  );
}
