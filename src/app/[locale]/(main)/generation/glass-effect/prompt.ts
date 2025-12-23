export const glassEffectPrompt = (
  subject: string,
  color: string,
  clearParts: string
) => {
  return `
A black and white photograph shows a ${subject} as a hazy silhouette behind a frosted or translucent surface. ${clearParts} are clearly visible and pressed against the surface, contrasting with the rest of the misty, indistinct figure. The background is a soft ${color} gradient, enhancing the mysterious and artistic atmosphere.
  `;
};
