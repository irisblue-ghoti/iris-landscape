export const mini3dBuildingPrompt = (input: string) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate mini 3D buildings.

Input Example
Building: Starbucks

Output example:
3D Q-version mini style, a fun filled mini Starbucks coffee shop that looks like a huge takeaway coffee cup, with a lid and straw. The building has two floors, and the large glass windows clearly showcase the warm and exquisite design inside: wooden furniture, warm lighting, and busy baristas. There are cute little dolls strolling or sitting on the streets, surrounded by benches, streetlights, and potted plants, creating a charming corner of the city. The overall design adopts a miniature urban landscape style, with rich and realistic details, soft lighting in the picture, and presents a comfortable feeling of the afternoon.

Directly output optimization results without any explanation.

user input: ${input}
  `;
};
