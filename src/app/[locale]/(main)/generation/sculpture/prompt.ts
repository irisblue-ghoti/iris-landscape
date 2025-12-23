export const sculptureImagePrompt = () => {
  return `
 A photorealistic image of an ultra-detailed sculpture of the subject in image made of shining marble. The sculpture should display smooth and reflective marble surface, emphasizing its luster and artistic craftsmanship. The design is elegant, highlighting the beauty and depth of marble. The lighting in the image should enhance the sculpture's contours and textures, creating a visually stunning and mesmerizing effect.
  `;
};

export const sculptureTextPrompt = (content: string) => {
  return `
 Generate photo realistic images of ultra-fine sculptures made of shiny marble based on the input content. Sculpture should showcase a smooth and reflective marble surface, emphasizing its luster and artistic craftsmanship. The design is elegant, highlighting the beauty and depth of marble. The lighting in the image should enhance the contours and textures of the sculpture, creating visually stunning and captivating effects.

User input content:
${content}
  `;
};
