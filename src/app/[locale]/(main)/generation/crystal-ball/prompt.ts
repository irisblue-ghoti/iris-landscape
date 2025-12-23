export const crystalBallImagePrompt = () => {
  return `
 Transform the subject in the image into a crystal ball scene. Overall environment: The crystal ball is placed on the desktop next to the window, with a blurry background and warm tones. The sunlight shone through the sphere, casting golden light and illuminating the surrounding darkness. The main body inside the crystal ball is a cute Q-version 3D design.
  `;
};

export const crystalBallTextPrompt = (content: string) => {
  return `
Generate images of crystal ball scenes based on user input. Overall environment: The crystal ball is placed on the desktop next to the window, with a blurry background and warm color tones. The sunlight passes through the sphere, casting a golden glow that illuminates the surrounding darkness. The main body inside the crystal ball is a cute Q-version 3D design.

User input content:
${content}
`;
};
