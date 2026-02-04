"use client";

import { motion } from "framer-motion";
import { X, Play, Share2 } from "lucide-react";
import { cinematicSpring } from "@/lib/motion";
import type { Album } from "./spotlight-card";

interface AlbumDetailProps {
  album: Album;
  onClose: () => void;
}

export function AlbumDetail({ album, onClose }: AlbumDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        layoutId={`card-${album.id}`}
        className="relative w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-7xl md:rounded-2xl overflow-hidden bg-[#050505] flex flex-col md:flex-row shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
        transition={cinematicSpring.dolly}
      >
        {/* Left: Immersive Cover */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-full">
          <img
            src={album.coverImage}
            alt={album.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/20 to-transparent" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="absolute top-6 left-6 md:hidden p-3 bg-black/40 backdrop-blur-md rounded-full text-white/70"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Right: Content */}
        <div className="relative flex-1 bg-[#050505] p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <motion.div layoutId={`content-${album.id}`}>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
                {album.title}
              </h2>
              <p className="text-xl text-white/60 font-medium">
                {album.artist} · {album.year}
              </p>
            </motion.div>

            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors hidden md:block"
            >
              <X size={32} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mb-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-16 px-10 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 hover:bg-gray-200 transition-colors"
            >
              <Play fill="currentColor" size={20} />
              Play Now
            </motion.button>
            <div className="flex gap-4">
              <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all">
                <Share2 size={24} />
              </button>
            </div>
          </div>

          {/* Tracklist - Minimal & Clean */}
          <div className="flex-1 overflow-y-auto pr-4 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="group flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-6">
                  <span className="text-white/20 font-mono text-sm w-4 group-hover:text-white transition-colors">
                    {i}
                  </span>
                  <div>
                    <div className="text-white font-medium text-lg">
                      Movement {i}
                    </div>
                    <div className="text-white/30 text-sm">
                      Allegro Moderato
                    </div>
                  </div>
                </div>
                <div className="text-white/30 text-sm font-mono group-hover:text-white transition-colors">
                  4:12
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
