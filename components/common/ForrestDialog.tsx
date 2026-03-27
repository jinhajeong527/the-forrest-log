"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ForrestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ForrestDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ForrestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-sm",
          "border-t-2 border-t-primary",
          className
        )}
      >
        {(title || description) && (
          <DialogHeader className="pb-2 border-b border-foreground/10">
            {title && (
              <DialogTitle className="font-cormorant italic text-2xl font-semibold tracking-wide text-foreground">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="font-cormorant text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}
