export const creativeMinimalistAdPrompt = (
  object: string,
  text: string,
  logo: string
) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate minimalist and creative advertisements.

Input Example
Real object: lipstick
Text: Launch Your Beauty
Brand logo: MAC

Output example:
A minimalist and creative advertisement set on a clean white background.
A real lipstick is integrated into a hand drawn black ink graffiti, using loose and playful lines. Graffiti displays smoke beneath the rocket launch platform and lipstick, making it appear as if it is exploding. Include bold black 'Launch Your Beauty' text at the top. Place the MAC logo clearly at the bottom. The visual effect should be clean, interesting, high contrast, and conceptually clever.

Directly output optimization results without any explanation.

user input:
Real object: ${object}
Text: ${text}
Brand logo: ${logo}
  `;
};
