import { cn } from "@/lib/utils";

export function Divider({ className }: { className?: string }) {
  return <div className={cn("w-full h-px bg-border/40", className)} />;
}
