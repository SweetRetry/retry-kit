"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { MouseEvent } from "react";
import { cinematicSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage: string; // Real URL
  year: string;
}

interface SpotlightCardProps {
  album: Album;
  className?: string; // For bento grid positioning
  onClick: (album: Album) => void;
}

export function SpotlightCard({
  album,
  className,
  onClick,
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Spotlight effect
  const maskImage = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <motion.div
      layoutId={`card-${album.id}`}
      onClick={() => onClick(album)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.005 }} // Almost imperceptible scale
      whileTap={{ scale: 0.98 }}
      transition={cinematicSpring.tactile}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] cursor-pointer",
        className,
      )}
    >
      {/* 1. Base Image - Darkened by default */}
      <div className="absolute inset-0">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 ease-out"
        />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* 2. Spotlight Reveal Layer - Shows pure border and slight sheen */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 border border-white/50 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={style}
      />

      {/* 3. Content */}
      <div className="relative z-20 h-full flex flex-col justify-end p-6">
        <motion.div layoutId={`content-${album.id}`}>
          <div className="overflow-hidden">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              {album.title}
            </h3>
          </div>
          <p className="text-sm font-medium text-white/50 mt-1 flex items-center gap-2">
            <span>{album.artist}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{album.year}</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
