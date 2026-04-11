import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props extends ComponentProps<"input"> {
  containerClassName?: string;
}

export default function ForrestSearchInput({
  className,
  containerClassName,
  ...props
}: Props) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      <Input
        {...props}
        className={cn(
          "pl-8 h-8 text-sm font-cormorant rounded-sm border-foreground/20 focus-visible:ring-0 focus-visible:border-foreground/40",
          className
        )}
      />
    </div>
  );
}
