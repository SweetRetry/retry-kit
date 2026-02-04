import { LayoutShell } from "@/components/layout-shell";
import { Nav } from "@/components/nav";
import { Route, Switch, useLocation } from "wouter";
import { AnimatePresence, motion } from "motion/react";
import Home from "@/pages/Home";
import Showcase from "@/pages/Showcase";
import Audit from "@/pages/Audit";
import { ModeToggle } from "@/components/mode-toggle";

function App() {
  const [location] = useLocation();

  return (
    <LayoutShell>
      <header className="flex justify-between items-center py-4 md:py-8 border-b border-border/10 mb-8 md:mb-16">
        <div className="font-bold text-lg tracking-tight">System.</div>
        <div className="flex items-center gap-6">
          <Nav />
          <ModeToggle />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/">
            <PageWrapper>
              <Home />
            </PageWrapper>
          </Route>
          <Route path="/showcase">
            <PageWrapper>
              <Showcase />
            </PageWrapper>
          </Route>
          <Route path="/audit">
            <PageWrapper>
              <Audit />
            </PageWrapper>
          </Route>

          {/* Fallback 404 */}
          <Route>
            <div className="py-24 text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-muted-foreground">Page not found</p>
            </div>
          </Route>
        </Switch>
      </AnimatePresence>

      <footer className="py-12 border-t border-border/40 mt-32 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-6">
        <div>Minimal Style Guide Example</div>
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-foreground transition-colors">
            Github
          </span>
          <span className="cursor-pointer hover:text-foreground transition-colors">
            Twitter
          </span>
          <span className="cursor-pointer hover:text-foreground transition-colors">
            Documentation
          </span>
        </div>
      </footer>
    </LayoutShell>
  );
}

// Wrapper for page transitions
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default App;
