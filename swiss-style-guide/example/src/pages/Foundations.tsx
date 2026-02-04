import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../lib/swiss-motion";

const FoundationSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <motion.section variants={itemVariants} className="mb-24">
    <h2 className="text-2xl font-bold mb-8 border-b border-border pb-4 flex justify-between items-baseline">
      <span>{title}</span>
      <span className="text-xs font-mono text-muted-foreground font-normal tracking-wider">
        SYS.CORE
      </span>
    </h2>
    {children}
  </motion.section>
);

const ColorSwatch = ({
  name,
  variable,
  items,
}: {
  name: string;
  variable: string;
  items: { label: string; class: string }[];
}) => (
  <div className="space-y-4">
    <div className="h-32 w-full border border-border relative group overflow-hidden">
      <div className={`absolute inset-0 ${variable}`} />
      <div className="absolute top-2 left-2 text-xs font-mono bg-background/90 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {variable}
      </div>
    </div>
    <div className="flex flex-col gap-1">
      <span className="font-bold text-sm tracking-wide">{name}</span>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex justify-between text-xs font-mono text-muted-foreground border-b border-border/50 pb-1 last:border-0"
        >
          <span>{item.label}</span>
          <span className={item.class}>Aa</span>
        </div>
      ))}
    </div>
  </div>
);

export default function Foundations() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <header className="mb-20">
        <motion.h1
          variants={itemVariants}
          className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-bold tracking-tight mb-6"
        >
          Core Foundations.
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          The mathematical and chromatic constants that define the system's
          objective reality.
        </motion.p>
      </header>

      <FoundationSection title="01. Chromatic System">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <ColorSwatch
            name="International Blue"
            variable="bg-primary"
            items={[
              { label: "Action", class: "text-primary" },
              { label: "Focus", class: "text-primary" },
            ]}
          />
          <ColorSwatch
            name="Swiss Red"
            variable="bg-destructive"
            items={[
              { label: "Error", class: "text-destructive" },
              { label: "Alert", class: "text-destructive" },
            ]}
          />
          <ColorSwatch
            name="Canvas White"
            variable="bg-background"
            items={[
              {
                label: "Background",
                class: "text-background bg-foreground px-1",
              },
              { label: "Surface", class: "text-background bg-foreground px-1" },
            ]}
          />
          <ColorSwatch
            name="Ink Black"
            variable="bg-foreground"
            items={[
              { label: "Typography", class: "text-foreground" },
              { label: "Icons", class: "text-foreground" },
            ]}
          />
        </div>
      </FoundationSection>

      <FoundationSection title="02. The 8-Point Grid">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              The spatial system is built on an 8px atomic unit, ensuring rhythm
              and sub-pixel perfection across all viewports.
            </p>
            <ul className="space-y-4 font-mono text-sm border-l border-border pl-6">
              <li className="flex justify-between">
                <span>Unit.xs</span>
                <span className="text-muted-foreground">8px (0.5rem)</span>
              </li>
              <li className="flex justify-between">
                <span>Unit.sm</span>
                <span className="text-muted-foreground">16px (1.0rem)</span>
              </li>
              <li className="flex justify-between font-bold text-primary">
                <span>Unit.base</span>
                <span className="text-muted-foreground">24px (1.5rem)</span>
              </li>
              <li className="flex justify-between">
                <span>Unit.lg</span>
                <span className="text-muted-foreground">32px (2.0rem)</span>
              </li>
              <li className="flex justify-between">
                <span>Unit.xl</span>
                <span className="text-muted-foreground">48px (3.0rem)</span>
              </li>
              <li className="flex justify-between">
                <span>Unit.2xl</span>
                <span className="text-muted-foreground">64px (4.0rem)</span>
              </li>
              <li className="flex justify-between">
                <span>Unit.Section</span>
                <span className="text-muted-foreground">80px (5.0rem)</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/30 border border-border p-8 relative min-h-[300px] flex items-center justify-center">
            <div className="grid grid-cols-4 gap-2 w-full max-w-[200px]">
              <div className="h-2 w-full bg-primary/20 col-span-4 mb-4" />{" "}
              {/* 8px */}
              <div className="h-4 w-full bg-primary/40 col-span-2" />{" "}
              {/* 16px */}
              <div className="h-4 w-full bg-primary/40 col-span-2" />
              <div className="h-6 w-full bg-primary rounded-sm col-span-4 mt-2" />{" "}
              {/* 24px */}
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-muted-foreground">
              FIG. 2.1 - SPATIAL RHYTHM
            </div>
          </div>
        </div>
      </FoundationSection>

      <FoundationSection title="03. Depth & Layering">
        <div className="grid grid-cols-3 gap-8 text-center bg-muted/20 p-8 border border-border">
          <div className="bg-background border border-border p-8 h-32 flex items-center justify-center">
            <span className="font-mono text-xs">Level 0</span>
          </div>
          <div className="bg-background border border-border p-8 h-32 flex items-center justify-center relative translate-y-[-8px] translate-x-[-8px] z-10 border-b-2 border-r-2">
            <span className="font-mono text-xs">Level 1 (Hover)</span>
          </div>
          <div className="bg-background border-2 border-foreground p-8 h-32 flex items-center justify-center relative z-20 shadow-none">
            <span className="font-mono text-xs">Level 2 (Modal)</span>
          </div>
        </div>
        <p className="mt-4 text-xs font-mono text-muted-foreground text-center uppercase tracking-widest">
          No Shadows. Only Borders & Position.
        </p>
      </FoundationSection>
    </motion.div>
  );
}
