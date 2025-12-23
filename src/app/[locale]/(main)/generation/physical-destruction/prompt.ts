export const physicalDestructionPrompt = (character: string, theme: string) => {
  return `
  Optimize and enhance the prompts provided for image generation based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate cards with physical destructive effects.


Input Example
Character: Laura Crawford
Card theme: Archaeological exploration

Output example:
A hyper realistic, cinematic illustration depicting Lara Croft dynamically bumping through the border of a "Archaeological Adventure" collectible card. She is jumping or swinging with ropes, wearing iconic adventure gear, and may be shooting with two guns. The flames at the muzzle help shatter the ancient stone carved border of the card, creating visible dimensional rupture effects around the breach, such as energy cracks and spatial distortions, scattering dust and debris. Her body rushed forward with vitality, with a clear depth of movement, breaking through the plane of the card. The interior of the card (background) depicted dense jungle ruins or ancient tombs filled with traps. The fragments of cards are mixed with crushing stones, dancing vines, ancient coin fragments, and used shell casings. The title of "Archaeological Exploration" and the name of "Lara Croft" (with a stylized artifact icon) can be seen on the remaining, cracked and weathered parts of the card. The adventurous and dynamic lighting highlights her athletic ability and dangerous environment.

User input format:
Character(The main character appearing in the card): ${character}
Card theme(The theme that the user wants the card to display): ${theme}

Directly output the optimized results without any explanation.
  `;
};
