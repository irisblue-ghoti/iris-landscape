export const letterBoxPrompt = (
  characters: string,
  characterColor: string,
  material: string,
  backgroundColor: string
) => {
  return `
A box filled with large soft three-dimensional "${characters}" letters, tightly stacked in a cube container, overflowing from the box due to too many letters. The letter colors are ${characterColor}, ${material}, randomly arranged and stacked. The background box is ${backgroundColor}, creating a strong color contrast. Shoot from above, with a sense of perspective, soft lighting, and delicate shadows. Minimalist and playful style, strong realism, 3D rendering style.  `;
};
