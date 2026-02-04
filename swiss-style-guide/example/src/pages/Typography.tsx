import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../lib/swiss-motion";

const TypographyRow = ({ role, size, tracking, weight, sample }: any) => (
  <div className="grid grid-cols-12 gap-4 py-8 border-b border-border items-baseline">
    <div className="col-span-12 md:col-span-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">
      <div>{role}</div>
      <div className="opacity-50">{size}</div>
    </div>
    <div className="col-span-12 md:col-span-9 overflow-hidden">
      <div className={`${tracking} ${weight}`} style={{ fontSize: size }}>
        {sample}
      </div>
    </div>
  </div>
);

export default function Typography() {
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
          Objective Type.
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          A fluid scale based on the Perfect Fourth (1.333), ensuring
          hierarchical clarity across all devices.
        </motion.p>
      </header>

      <motion.div variants={itemVariants} className="border-t border-border">
        <TypographyRow
          role="Display XL"
          size="clamp(3rem, 6vw, 6rem)"
          weight="font-bold"
          tracking="tracking-tighter"
          sample="Systemic Minimalism"
        />
        <TypographyRow
          role="Display L"
          size="clamp(2.5rem, 5vw, 4.5rem)"
          weight="font-bold"
          tracking="tracking-tight"
          sample="International Style"
        />
        <TypographyRow
          role="Heading L"
          size="clamp(2.0rem, 4vw, 3.8rem)"
          weight="font-semibold"
          tracking="tracking-tight"
          sample="Functional Aesthetics"
        />
        <TypographyRow
          role="Heading M"
          size="clamp(1.5rem, 3vw, 2.5rem)"
          weight="font-medium"
          tracking="tracking-normal"
          sample="The grid is a regulatory system."
        />
        <TypographyRow
          role="Body L"
          size="1.25rem"
          weight="font-normal"
          tracking="tracking-normal"
          sample="Design is not the product of imagination, but of logical selection."
        />
        <TypographyRow
          role="Body M"
          size="1rem"
          weight="font-normal"
          tracking="tracking-normal"
          sample="The objective of the designer is to create an order that is as clear as possible."
        />
        <TypographyRow
          role="Label"
          size="0.75rem"
          weight="font-bold"
          tracking="tracking-[0.1em]"
          sample="SPECIFICATION 2026"
        />
        <TypographyRow
          role="Mono"
          size="0.875rem"
          weight="font-mono font-normal"
          tracking="tracking-normal"
          sample="const system = { precision: 1.0 };"
        />
      </motion.div>
    </motion.div>
  );
}
