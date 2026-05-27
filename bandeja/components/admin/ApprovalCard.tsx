"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ApprovalCardProps {
  name: string;
  email: string;
  image?: string | null;
  detail: string;
  meta?: string;
  onApprove: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export function ApprovalCard({
  name,
  email,
  image,
  detail,
  meta,
  onApprove,
  onReject,
  isLoading,
}: ApprovalCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start gap-4">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 font-display text-lg text-lime-300">
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold text-neutral-100">{name}</p>
          <p className="text-xs text-neutral-500">{email}</p>
        </div>
      </div>

      <div className="mb-4 rounded-[4px] border border-neutral-800 bg-neutral-900/40 p-3 text-sm">
        <p className="font-medium text-neutral-200">{detail}</p>
        {meta && <p className="mt-1 text-xs text-neutral-500">{meta}</p>}
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={onApprove}
          disabled={isLoading}
        >
          <CheckCircle className="h-4 w-4" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="flex-1"
          onClick={onReject}
          disabled={isLoading}
        >
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
      </div>
    </Card>
  );
}
