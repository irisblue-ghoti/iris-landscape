export const superRealisticFigurePrompt = (input: string) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate branded pills.

Input Example
Starbucks

Output Example
Create a 3:2 image of a tall, lifelike, and vibrant capsule floating horizontally.

Its left half is the iconic Starbucks green, marked with the words' Starbucks – Uplifting the Everyday 'and the classic Siren logo.

The right half is transparent and filled with floating roasted coffee beans, delicate froth swirls, hand drawn coffee cup icons, and abstract warm toned lines representing community connections, requiring a background color.

Directly output optimization results without any explanation.


user input: ${input}
  `;
};
