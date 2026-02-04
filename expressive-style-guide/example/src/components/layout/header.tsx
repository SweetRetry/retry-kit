"use client";

import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Index" },
    { href: "/archive", label: "Archive" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 p-6 md:p-10 z-40 flex justify-between items-center mix-blend-difference pointer-events-none text-white">
      <Link href="/">
        <a className="text-xl font-bold tracking-tighter pointer-events-auto hover:opacity-80 transition-opacity">
          MUSEUM.
        </a>
      </Link>

      <nav className="pointer-events-auto flex gap-8 text-sm font-medium">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "transition-all duration-300 relative",
                location === item.href
                  ? "opacity-100"
                  : "opacity-40 hover:opacity-100",
              )}
            >
              {item.label}
              {location === item.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          </Link>
        ))}
      </nav>
    </header>
  );
}
