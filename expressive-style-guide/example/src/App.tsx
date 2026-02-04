"use client";

import { Route, Switch } from "wouter";
import { Header } from "@/components/layout/header";
import Home from "@/pages/Home";
import Archive from "@/pages/Archive";
import About from "@/pages/About";

function App() {
  return (
    <div className="min-h-screen w-full bg-[#030303] text-white selection:bg-white/30 selection:text-white font-sans overflow-x-hidden">
      <Header />

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/archive" component={Archive} />
        <Route path="/about" component={About} />

        {/* Simple 404 handler */}
        <Route>
          <main className="flex items-center justify-center min-h-screen">
            <h2 className="text-2xl font-light opacity-20 tracking-widest uppercase">
              404 · Void
            </h2>
          </main>
        </Route>
      </Switch>

      {/* Footer / Credits */}
      <footer className="p-10 text-center opacity-10 text-[10px] tracking-[0.5em] uppercase hover:opacity-100 transition-opacity duration-1000">
        Museum for Sonic Architecture · 2026
      </footer>
    </div>
  );
}

export default App;
