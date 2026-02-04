export const cinematicSpring = {
  // Dolly Zoom - Smooth, stable, no bounce, like a camera slide
  dolly: { type: "spring", stiffness: 200, damping: 40, mass: 1 },

  // Tactile - Minimal movement, high precision
  tactile: { type: "spring", stiffness: 450, damping: 35 },
} as const;

export const transitions = {
  layout: cinematicSpring.dolly,
  interaction: cinematicSpring.tactile,
};
