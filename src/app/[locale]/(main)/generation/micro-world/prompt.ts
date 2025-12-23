export const microWorldPrompt = (
  externalWorld: string,
  internalWorld: string
) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate isometric 3D microcosms.


Input Example
External world: The mug
Internal World: Caf é

Output example:
A realistic and fun miniature modern caf é, presented in a lively mug filled with coffee. This miniature caf é includes a mini bar that may have tiny coffee and bean grinders, miniature customer figurines sitting at several small tables, and mini menu boards or decorative paintings on the walls (inside the mugs).
The real coffee surface forms the "floor" of the coffee shop, and there may be tiny "latte" patterns floating on it. The mug is placed on a coffee table or bar counter, next to a real croissant, laptop, or sugar can, creating a surreal contrast between the miniature commercial space and everyday drinks. Super realistic style, macro photography, shallow depth of field (focusing on vivid scenes and characters in the coffee shop), bright and soft, simulating natural lighting or indoor lighting in the coffee shop, high details (reflected in the metallic texture of miniature equipment, the posture of characters, and the decorative details of the coffee shop).

Directly output optimization results without any explanation.

User input :
External world: ${externalWorld}
Internal World: ${internalWorld}
  `;
};
