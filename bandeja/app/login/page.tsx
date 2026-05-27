import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import Link from "next/link";
import { LoginButton } from "@/components/auth/LoginButton";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a0a08] px-5">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0a08_0%,#0d1a0a_50%,#0a0a08_100%)]" />
      <div className="hero-grid absolute inset-0 opacity-40" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="font-display text-4xl uppercase tracking-[0.16em] text-lime-300"
          >
            BANDEJA
          </Link>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Zap className="h-3.5 w-3.5 text-lime-300" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
              Platform Padel #1 Indonesia
            </span>
          </div>
        </div>

        <div className="rounded-[4px] border border-neutral-800 bg-[#111110] p-8">
          <h1 className="mb-2 font-display text-3xl uppercase tracking-[0.08em] text-neutral-100">
            Masuk ke Akun
          </h1>
          <p className="mb-8 text-sm text-neutral-500">
            Login untuk mulai booking, cari pelatih, dan tantang lawan tanding.
          </p>

          <LoginButton className="w-full" size="default" />

          <p className="mt-6 text-center text-xs text-neutral-600">
            Dengan login, kamu menyetujui{" "}
            <span className="text-neutral-500">syarat & ketentuan</span> BANDEJA.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-700">
          <Link href="/" className="hover:text-neutral-500 transition-colors">
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
