import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-orange-400">{error}</span> : null}
    </label>
  );
}
