"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function UserAuthForm() {
  const t = useTranslations();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        if (res?.error) {
          toast.error(t("user.auth.login_failed"));
        } else {
          router.push("/" as any);
          router.refresh();
        }
      } else {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || t("user.auth.register_failed"));
        } else {
          toast.success(t("user.auth.register_success"));
          setIsLogin(true);
        }
      }
    } catch {
      toast.error(t("global.error.network_error"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="name">{t("user.auth.name")}</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t("user.auth.name_placeholder")}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">{t("user.auth.email")}</Label>
        <Input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder={t("user.auth.email_placeholder")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("user.auth.password")}</Label>
        <Input
          id="password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={t("user.auth.password_placeholder")}
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLogin ? (
          t("user.auth.login")
        ) : (
          t("user.auth.register")
        )}
      </Button>
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-muted-foreground hover:underline"
      >
        {isLogin
          ? t("user.auth.switch_to_register")
          : t("user.auth.switch_to_login")}
      </button>
    </form>
  );
}
