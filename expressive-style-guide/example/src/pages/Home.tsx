"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpotlightCard } from "@/components/expressive/spotlight-card";
import { AlbumDetail } from "@/components/expressive/album-detail";
import { ALBUMS, type Album } from "@/lib/data";

export default function Home() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  return (
    <main className="container mx-auto px-4 pt-32 pb-32 max-w-7xl">
      <div className="mb-20">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-white leading-[0.9]"
        >
          Sonic
          <br />
          Architecture
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/40 max-w-md ml-2"
        >
          A collection of auditory experiences curated for the discerning
          listener.
        </motion.p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
        <SpotlightCard
          album={ALBUMS[0]}
          onClick={setSelectedAlbum}
          className="md:col-span-2 md:row-span-2"
        />
        <SpotlightCard
          album={ALBUMS[1]}
          onClick={setSelectedAlbum}
          className="md:row-span-2"
        />
        <SpotlightCard album={ALBUMS[2]} onClick={setSelectedAlbum} />
        <SpotlightCard album={ALBUMS[3]} onClick={setSelectedAlbum} />
        <SpotlightCard
          album={ALBUMS[4]}
          onClick={setSelectedAlbum}
          className="md:col-span-3 lg:col-span-1"
        />
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <AlbumDetail
            album={selectedAlbum}
            onClose={() => setSelectedAlbum(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
