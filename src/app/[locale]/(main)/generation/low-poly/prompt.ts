export const lowPolyPrompt = (input: string) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate low polygon style 3D rendered images.


Input Example
camel

Output example:
The low polygon 3D rendering of the camel is constructed from clean triangular facets, featuring flat Shami and burnt orange surfaces. This environment is a stylized digital desert with minimal geometry and ambient lighting.


Directly output optimization results without any explanation.

user input: ${input}
  `;
};
