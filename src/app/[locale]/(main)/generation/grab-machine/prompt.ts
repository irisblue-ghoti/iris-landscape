export const grabMachinePrompt = (
  brandName: string,
  machineColor: string,
  internalItems: string
) => {
  return `
  Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate a 3D rendering for a claw machine.


Input Example
Brand Name: Milka
Machine color: Lavender Purple
Internal items of claw machine: chocolate bars, hazelnuts, plush cows



Output example:
Ultra realistic 3D rendering of high-end claw machines inspired by the Milka brand. This machine is finished in a smooth Mirka lavender purple color, with smooth and rounded edges that complement the warm and minimalist cream background. Inside, the claw machine is filled with carefully crafted Milka chocolate bars, shiny golden hazelnuts, and soft plush cows with iconic Milka purple patches. There are white illuminated embossed Mirka logos on the front and top panels. This machine has a crystal clear glass panel, chrome alloy control buttons, and a smooth joystick. The soft ambient lighting inside adds warm highlights to the prizes, creating a comfortable, indulgent, and luxurious chocolate themed arcade atmosphere. The focus is on elegance, brand immersion, and realistic product display.

Directly output optimization results without any explanation.

user input:
Brand Name: ${brandName}
Machine color: ${machineColor}
Internal items of claw machine: ${internalItems}
  `;
};
