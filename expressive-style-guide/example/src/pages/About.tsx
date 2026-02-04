"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <main className="container mx-auto px-4 pt-32 pb-32 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-12">
          Architecture
          <br />
          of Sound.
        </h2>

        <div className="space-y-8 text-xl md:text-2xl text-white/50 leading-relaxed font-light">
          <p>
            MUSEUM is a digital sanctuary dedicated to the preservation and
            exhibition of high-fidelity sonic experiences.
          </p>
          <p>
            Our philosophy is built on the intersection of{" "}
            <span className="text-white">minimalist architecture</span> and{" "}
            <span className="text-white">expressive motion</span>. We believe
            that UI should be felt, not just seen.
          </p>
          <p>
            Every artifact in our archive is selected for its structural
            integrity and emotional resonance.
          </p>
        </div>

        <div className="mt-24 pt-12 border-t border-white/10 grid grid-cols-2 gap-12">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4">
              Philosophy
            </h4>
            <p className="text-sm text-white/60">
              Cinematic UI · Kinetic Minimalism · Content as Hero
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4">
              Location
            </h4>
            <p className="text-sm text-white/60">Digital Void · 010101</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
