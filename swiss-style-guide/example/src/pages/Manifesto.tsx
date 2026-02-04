import { motion } from "framer-motion";
import { Box, Grid as GridIcon, Type } from "lucide-react";
import { Link } from "wouter";
import { containerVariants, itemVariants, neoSwiss } from "../lib/swiss-motion";

const SwissButton = ({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
}) => {
  const baseClasses =
    "relative px-6 py-3 text-sm font-medium tracking-wide rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary inline-block text-center";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    outline:
      "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.0 }}
      whileTap={{ scale: 0.98 }}
      transition={neoSwiss.transition}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </motion.button>
  );
};

export default function Manifesto() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header Section */}
      <header className="grid grid-cols-12 gap-6 mb-32">
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-8"
        >
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4 font-mono">
            01_Identity
          </div>
          <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[0.9] font-bold tracking-tighter mb-8">
            Systemic
            <br />
            Minimalism.
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed max-w-2xl text-muted-foreground">
            A design philosophy rooted in objective clarity and mathematical
            precision. Form follows function. Less, but better.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-4 flex items-end justify-start lg:justify-end pb-2"
        >
          <div className="space-y-4">
            <div className="flex gap-4">
              <Link href="/foundations">
                <SwissButton variant="primary">Explore System</SwissButton>
              </Link>
              <Link href="/components">
                <SwissButton variant="outline">Components</SwissButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Feature Layout */}
      <section className="grid grid-cols-12 gap-6 mb-32">
        <motion.div
          variants={itemVariants}
          className="col-span-12 md:col-span-4 space-y-8"
        >
          <div className="bg-primary text-primary-foreground p-8 h-full min-h-[300px] flex flex-col justify-between">
            <Box className="w-8 h-8" strokeWidth={1.5} />
            <div>
              <h3 className="text-2xl font-bold mb-2">Zero Radius</h3>
              <p className="opacity-80 leading-relaxed">
                Strict geometric forms convey precision and stability. No
                decorative rounding.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="col-span-12 md:col-span-4"
        >
          <div className="border border-border p-8 h-full min-h-[300px] flex flex-col justify-between hover:bg-accent/50 transition-colors duration-300">
            <GridIcon className="w-8 h-8" strokeWidth={1.5} />
            <div>
              <h3 className="text-2xl font-bold mb-2">8-Point Grid</h3>
              <p className="text-muted-foreground leading-relaxed">
                Everything aligns to the 8px atomic unit. Order creates beauty.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="col-span-12 md:col-span-4"
        >
          <div className="border border-border p-8 h-full min-h-[300px] flex flex-col justify-between hover:bg-accent/50 transition-colors duration-300">
            <Type className="w-8 h-8" strokeWidth={1.5} />
            <div>
              <h3 className="text-2xl font-bold mb-2">Objective Type</h3>
              <p className="text-muted-foreground leading-relaxed">
                Typography is treated as image. Content is king. Legibility is
                paramount.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
