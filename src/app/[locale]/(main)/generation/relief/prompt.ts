export const reliefImagePrompt = () => {
  return `
 Convert the image into a three-dimensional hollow paper carving art style. The screen is clean and the paper surface is smooth and soft. Using layered cutting and collage techniques, create images with a strong sense of space and hierarchy.
  `;
};

export const reliefTextPrompt = (content: string) => {
  return `
 Generate images using the 3D hollow paper carving art style based on the input content. The screen is clean and the paper surface is smooth and soft. Use layered cutting and collage techniques to create images with a strong sense of space and hierarchy.

User input content:
${content}
  `;
};
