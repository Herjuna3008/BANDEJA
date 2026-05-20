"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "border-lime-300/80 bg-[#111110] text-neutral-100",
          title: "text-neutral-100",
          description: "text-neutral-400",
        },
      }}
    />
  );
}
