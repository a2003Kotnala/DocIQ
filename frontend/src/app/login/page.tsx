"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({ email: "admin@dociq.test", password: "password123", org_slug: "seed-org" });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await login(form);
      setSession({
        accessToken: response.access_token,
        organization: response.organization,
        user: response.user
      });
      router.push("/dashboard");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Login failed");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <Card className="w-full max-w-md p-8">
        <div className="font-display text-xl tracking-[0.24em] text-foreground">DOCIQ</div>
        <p className="mt-3 text-sm text-muted">Sign in to the tenant-scoped operations console.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input placeholder="Email" value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} />
          <Input placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((state) => ({ ...state, password: event.target.value }))} />
          <Input placeholder="Org Slug" value={form.org_slug} onChange={(event) => setForm((state) => ({ ...state, org_slug: event.target.value }))} />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button className="w-full" type="submit">Sign In</Button>
        </form>
      </Card>
    </main>
  );
}

