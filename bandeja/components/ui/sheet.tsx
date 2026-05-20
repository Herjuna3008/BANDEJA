"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed bottom-0 right-0 top-0 z-50 w-[320px] max-w-[85vw] border-l border-neutral-800 bg-[#111110] text-neutral-100 shadow-2xl outline-none",
        className,
      )}
      {...props}
    >
      {children}
      <SheetClose className="absolute right-5 top-5 rounded-[4px] p-1 text-neutral-500 hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300">
        <X className="h-5 w-5" />
        <span className="sr-only">Tutup menu</span>
      </SheetClose>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-neutral-800 px-6 py-7", className)} {...props} />;
}

function SheetTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-display text-3xl uppercase tracking-[0.08em]", className)}
      {...props}
    />
  );
}

export { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger };
