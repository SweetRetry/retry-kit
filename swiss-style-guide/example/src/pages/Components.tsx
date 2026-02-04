import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { containerVariants, itemVariants, neoSwiss } from "../lib/swiss-motion";

const ComponentBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border border-border p-8 md:p-12 mb-8">
    <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8">
      {title}
    </div>
    <div className="flex flex-wrap gap-8 items-start">{children}</div>
  </div>
);

const SwissButton = ({
  children,
  variant = "primary",
  size = "default",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "icon";
}) => {
  const base =
    "font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary inline-flex items-center justify-center gap-2 rounded-sm transition-colors";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  const sizes = {
    default: "h-11 px-8 py-2 text-sm",
    sm: "h-9 rounded-sm px-3 text-xs",
    icon: "h-10 w-10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.0 }}
      whileTap={{ scale: 0.98 }}
      transition={neoSwiss.transition}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </motion.button>
  );
};

const SwissInput = () => (
  <div className="relative group min-w-[300px]">
    <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-foreground/80">
      Email Address
    </label>
    <div className="relative">
      <input
        type="email"
        placeholder="name@example.com"
        className="flex h-12 w-full border border-input bg-transparent px-3 py-1 text-sm shadow-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-none focus:border-primary placeholder:text-muted-foreground/50"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
      </div>
    </div>
    <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">
      REQUIRED FIELD
    </p>
  </div>
);

const SwissBadge = ({ children, variant = "default" }: any) => {
  const variants: any = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "text-foreground border-border",
  };
  return (
    <div
      className={`inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wide ${variants[variant]}`}
    >
      {children}
    </div>
  );
};

export default function Components() {
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
          Atomic Units.
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          Standardized interactive elements designed for efficiency and
          affordance. Zero radius by default.
        </motion.p>
      </header>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-12">
        <ComponentBlock title="01. Button System">
          <SwissButton variant="primary">Primary Action</SwissButton>
          <SwissButton variant="secondary">Secondary</SwissButton>
          <SwissButton variant="outline">Outline View</SwissButton>
          <SwissButton variant="destructive">Delete Data</SwissButton>
          <SwissButton variant="ghost" size="icon">
            <Bell className="w-4 h-4" />
          </SwissButton>
        </ComponentBlock>

        <ComponentBlock title="02. Input Fields">
          <SwissInput />
          <div className="min-w-[300px]">
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-foreground/80">
              Access Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value="••••••••••••"
                readOnly
                className="flex h-12 w-full bg-muted/30 border-b-2 border-border px-3 py-1 text-sm focus:outline-none rounded-none font-mono tracking-widest"
              />
              <SwissButton variant="outline" size="sm">
                COPY
              </SwissButton>
            </div>
          </div>
        </ComponentBlock>

        <ComponentBlock title="03. Status Badges">
          <SwissBadge>Active</SwissBadge>
          <SwissBadge variant="secondary">Draft</SwissBadge>
          <SwissBadge variant="outline">Archived</SwissBadge>
        </ComponentBlock>
      </motion.div>
    </motion.div>
  );
}
