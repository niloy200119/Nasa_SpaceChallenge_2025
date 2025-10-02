// Minimalist skyline silhouettes (paths) for parallax variants.
export const SKYLINES = {
  highrise: [
    "M0 40 L10 40 L10 18 L14 18 L14 40 L20 40 L20 10 L28 10 L28 40 L34 40 L34 22 L38 22 L38 40 L48 40 L48 14 L52 14 L52 40 L64 40",
  ],
  coastal: [
    "M0 40 L8 40 L8 24 L12 24 L12 40 L18 40 L18 16 L22 16 L22 40 L30 40 L30 28 L34 28 L34 40 L44 40 L44 20 L48 20 L48 40 L64 40",
  ],
  lowrise: [
    "M0 40 L6 40 L6 30 L10 30 L10 40 L16 40 L16 26 L20 26 L20 40 L26 40 L26 32 L30 32 L30 40 L38 40 L38 28 L42 28 L42 40 L64 40",
  ]
}

// Scale path to any width/height via viewBox in SVG container.