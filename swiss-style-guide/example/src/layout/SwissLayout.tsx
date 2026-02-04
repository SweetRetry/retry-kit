import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { neoSwiss } from "../lib/swiss-motion";

const GridOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-0 flex justify-center px-6 md:px-10 xl:px-20 h-full w-full opacity-[0.03]">
    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 w-full h-full border-x border-black/10 dark:border-white/10">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`h-full border-r border-black/10 dark:border-white/10 last:border-r-0 ${i >= 4 ? "hidden md:block" : ""} ${i >= 8 ? "lg:block" : "lg:hidden"}`}
        />
      ))}
    </div>
  </div>
);

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <motion.a
        className={`block text-sm font-mono tracking-wider cursor-pointer py-1 ${isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
        whileHover={{ x: 4 }}
        transition={neoSwiss.transition}
      >
        {isActive && <span className="mr-2 text-primary">→</span>}
        {children}
      </motion.a>
    </Link>
  );
};

export const SwissLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground relative">
      <GridOverlay />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 md:px-10 xl:px-20 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-primary" />
              <span className="font-bold tracking-tight text-lg">
                NEO-SWISS
                <span className="text-muted-foreground font-light">_SYS</span>
              </span>
            </div>
            <div className="hidden md:flex gap-8 text-xs font-mono text-muted-foreground">
              <span>P: 47.3769° N</span>
              <span>ZURICH_Hb</span>
            </div>
          </div>
        </header>

        <div className="flex-1 container mx-auto px-6 md:px-10 xl:px-20 pt-32 pb-20 flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-64 shrink-0 flex flex-col gap-8 fixed lg:static top-20 left-0 h-auto bg-background/95 lg:bg-transparent p-6 lg:p-0 border-b lg:border-none border-border w-full z-40">
            <div>
              <div className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
                01 Context
              </div>
              <nav className="space-y-2">
                <NavLink href="/">Manifesto</NavLink>
              </nav>
            </div>
            <div>
              <div className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
                02 System
              </div>
              <nav className="space-y-2">
                <NavLink href="/foundations">Foundations</NavLink>
                <NavLink href="/typography">Typography</NavLink>
                <NavLink href="/components">Components</NavLink>
              </nav>
            </div>
          </aside>

          <main className="flex-1 w-full min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
};
