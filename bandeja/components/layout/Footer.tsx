import { SITE } from "@/constants/site";
import { Separator } from "@/components/ui/separator";

const columns = [
  { title: "Venue", links: ["Bandeja South", "Bandeja North", "Bandeja West"] },
  { title: "Layanan", links: ["Booking Lapangan", "Sewa Pelatih", "Cari Lawan"] },
  { title: "Info", links: ["Tentang Kami", "Kontak", "FAQ"] },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-[#111110] px-5 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <span className="mb-4 block font-display text-4xl uppercase tracking-[0.14em] text-lime-300">
              {SITE.name}
            </span>
            <p className="max-w-md text-sm leading-7 text-neutral-500">{SITE.description}</p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-200">
                {column.title}
              </h3>
              <div className="grid gap-2">
                {column.links.map((link) => (
                  <a
                    key={link}
                    href={column.title === "Venue" ? "#venues" : "#match"}
                    className="text-sm text-neutral-500 transition-colors hover:text-lime-300"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-3 text-xs text-neutral-600 md:flex-row md:items-center md:justify-between">
          <span>Copyright 2026 BANDEJA. All rights reserved.</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lime-300">
            Built for padel lovers
          </span>
        </div>
      </div>
    </footer>
  );
}
