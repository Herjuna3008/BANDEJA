import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        lime: "bg-lime-300/15 text-lime-300",
        orange: "bg-orange-500/15 text-orange-400",
        teal: "bg-teal-300/15 text-teal-300",
        muted: "bg-neutral-800 text-neutral-400",
      },
    },
    defaultVariants: {
      variant: "lime",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
