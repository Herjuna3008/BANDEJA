"use client";

import { Menu, Zap } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/constants/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserDropdown } from "@/components/auth/UserDropdown";
import type { Role } from "@prisma/client";

interface NavbarProps {
  session?: {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
  } | null;
}

export function Navbar({ session }: NavbarProps) {
  const isLoggedIn = !!session?.user;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-neutral-800 bg-[#0a0a08]/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-12"
        aria-label="Navigasi utama"
      >
        <Link
          href="/"
          className="font-display text-3xl uppercase tracking-[0.16em] text-lime-300"
          aria-label="BANDEJA home"
        >
          {SITE.name}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {SITE.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-lime-300"
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <UserDropdown
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
              role={session.user.role}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">
                  <Zap className="h-4 w-4" />
                  Book Sekarang
                </Link>
              </Button>
            </div>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Buka menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="left-auto right-0 top-0 h-dvh max-w-[320px] translate-x-0 translate-y-0 rounded-none">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid gap-3 p-6">
              {SITE.nav.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-[4px] border border-neutral-800 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-neutral-300"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="rounded-[4px] border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-lime-300"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-[4px] border border-lime-300 bg-lime-300 px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-neutral-950"
                  >
                    Login
                  </Link>
                )}
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
