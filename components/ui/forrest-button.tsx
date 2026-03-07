import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ForrestButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "font-cormorant tracking-wide rounded-sm transition-colors duration-300",
        className
      )}
      {...props}
    />
  )
}
