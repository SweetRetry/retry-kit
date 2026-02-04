"use client";

import { motion } from "framer-motion";
import { ALBUMS } from "@/lib/data";
import { cinematicSpring } from "@/lib/motion";

export default function Archive() {
  return (
    <main className="container mx-auto px-4 pt-32 pb-32 max-w-5xl">
      <header className="mb-20">
        <h2 className="text-4xl font-bold tracking-tighter text-white mb-4">
          Archive
        </h2>
        <p className="text-white/40">
          The complete collection of sonic artifacts.
        </p>
      </header>

      <div className="space-y-px bg-white/5 border-y border-white/5">
        {ALBUMS.map((album, i) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...cinematicSpring.dolly, delay: i * 0.05 }}
            className="group grid grid-cols-12 items-center py-8 px-4 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="col-span-1 text-white/20 font-mono text-xs">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="col-span-7 flex flex-col">
              <span className="text-xl font-medium text-white group-hover:translate-x-2 transition-transform duration-500">
                {album.title}
              </span>
              <span className="text-sm text-white/30 uppercase tracking-widest mt-1">
                {album.artist}
              </span>
            </div>
            <span className="col-span-2 text-white/40 text-sm font-mono text-right">
              {album.year}
            </span>
            <div className="col-span-2 flex justify-end">
              <div className="w-12 h-12 rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img
                  src={album.coverImage}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
