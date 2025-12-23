export const leftPagePrompt = (sceneDescription: string) => {
  return `
 Create a 3D scene showcasing an open ancient book with yellowed pages and damaged edges, placed on a wooden table. The left page is densely packed with ancient text layout, while the right page presents a miniature scene with naked eye 3D effect: ${sceneDescription} There is a faint halo around the book page, creating a sense of three dimensionality, and some small decorations related to the miniature scene (such as petals) are scattered on the table. The background is a soft beige color, and the overall atmosphere is full of ancient style poetry and historical sense. Exquisite details and elegant colors showcase the vicissitudes of ancient books and the tranquil beauty of the courtyard.
  `;
};

export const rightPagePrompt = (sceneDescription: string) => {
  return `
  Create a 3D scene showcasing an open ancient book with yellowed pages and damaged edges, placed on a wooden table. The right page is densely packed with ancient text layout, while the left page presents a miniature scene with naked eye 3D effect: ${sceneDescription} There is a faint halo around the book page, creating a sense of three dimensionality, and some small decorations related to the miniature scene (such as petals) are scattered on the table. The background is a soft beige color, and the overall atmosphere is full of ancient style poetry and historical sense. Exquisite details and elegant colors showcase the vicissitudes of ancient books and the tranquil beauty of the courtyard.
  `;
};
