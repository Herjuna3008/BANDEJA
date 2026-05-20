"use client";

import { Menu, Zap } from "lucide-react";
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

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-neutral-800 bg-[#0a0a08]/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-12"
        aria-label="Navigasi utama"
      >
        <a
          href="#top"
          className="font-display text-3xl uppercase tracking-[0.16em] text-lime-300"
          aria-label="BANDEJA home"
        >
          {SITE.name}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {SITE.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-lime-300"
            >
              {item.label}
            </a>
          ))}
          <Button asChild size="sm">
            <a href="#venues">
              <Zap className="h-4 w-4" />
              Book Sekarang
            </a>
          </Button>
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
                  <a
                    href={item.href}
                    className="rounded-[4px] border border-neutral-800 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-neutral-300"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
