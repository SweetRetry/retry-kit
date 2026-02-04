import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { layoutVar } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LayoutShellProps {
  children: React.ReactNode;
  className?: string;
}

export function LayoutShell({ children, className }: LayoutShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background font-sans">
      <AnimatePresence mode="wait">
        <motion.main
          variants={layoutVar}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            // Constraint: >40% whitespace.
            // Responsive: Mobile uses compact mode (px-4 py-8). Desktop uses loose (px-8 py-24).
            // Max width constraint to ensure readability and negative space.
            "mx-auto w-full max-w-screen-xl px-4 pt-6 pb-12 md:px-12 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32",
            "flex flex-col gap-16 md:gap-32", // Loose spacing for sections (64px/128px)
            className,
          )}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Noise Texture / Grain could be added here if allowed, but Minimal Guide says "Honest Design" - no fake textures unless functional. We skip. */}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("flex flex-col gap-8 md:gap-12", "w-full", className)}
    >
      {children}
    </section>
  );
}
