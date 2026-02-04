export const neoSwiss = {
  // Polite interface motion
  transition: {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1] as const, // Expo Out
  },
  // Stagger for list items
  stagger: 0.05,
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: neoSwiss.transition,
  },
};
