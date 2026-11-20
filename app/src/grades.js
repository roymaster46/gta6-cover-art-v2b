// The colour grades: each one tints every panel photo with a warm Vice City
// wash and a small saturation lift, so the seven portraits feel shot on the
// same evening. A grade is a top and bottom overlay colour plus a canvas
// filter string applied while the photo is drawn.
export const GRADES = {
  sunset: {
    label: 'Sunset',
    filter: 'saturate(1.18) contrast(1.06)',
    top: 'rgba(255, 122, 61, 0.10)',
    bottom: 'rgba(190, 30, 110, 0.30)',
  },
  neon: {
    label: 'Neon Nights',
    filter: 'saturate(1.32) contrast(1.08)',
    top: 'rgba(160, 40, 200, 0.20)',
    bottom: 'rgba(255, 40, 140, 0.22)',
  },
  golden: {
    label: 'Golden Hour',
    filter: 'saturate(1.12) contrast(1.04)',
    top: 'rgba(255, 178, 44, 0.14)',
    bottom: 'rgba(255, 96, 20, 0.18)',
  },
  dusk: {
    label: 'Dusk Blue',
    filter: 'saturate(1.05) contrast(1.05)',
    top: 'rgba(30, 60, 140, 0.20)',
    bottom: 'rgba(120, 40, 160, 0.20)',
  },
};

/** The grade ids in the order the studio lists them. */
export const GRADE_IDS = ['sunset', 'neon', 'golden', 'dusk'];
