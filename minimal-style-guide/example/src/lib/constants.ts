export const minimalMotion = {
  type: "spring",
  stiffness: 260,
  damping: 20, // No Bounce
  mass: 1,
} as const;

export const fadeInVar = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: minimalMotion,
};

export const layoutVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, // Custom ease for larger layout shifts
};
