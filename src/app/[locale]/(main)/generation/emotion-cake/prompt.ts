export const emotionCakePrompt = (
  pastryType: string,
  emotion: string,
  backgroundColor: string
) => {
  return `
Create a highly stylized 3D cartoon monster character inspired by ${pastryType}. This character should look like a shiny, soft, slightly glossy toy with rich buttery textures, exaggerated limbs, expressive cartoon eyes and mouth. Give it a specific emotion: ${emotion}, with white bold graphic elements around the head to enhance this feeling. Place the character against a bold, colorful ${backgroundColor} background with no additional elements. Render in Pixar style, vibrant, playful and highly expressive.
  `;
};
