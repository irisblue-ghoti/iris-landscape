export const doubleExposurePrompt = (input: string) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate game characters with double exposure.


Input Example
Character: Orc Shaman Thrall

Output example:
Double exposure, fusion, blending, overlapping double exposure images, double exposure style, showcase the wonderful double exposure composition of the silhouette of the wise orc shaman Sal (Gaul), harmoniously interwoven with the visually impactful and iconic Azeroth landscapes and symbols of his journey. The magnificent red spires and rugged canyons of Orgrimmar, the emerald green floating islands and ancestral souls under the spinning sky, and the crackling elemental energy (lightning, earth, water whirlpools) echo outward through the texture of his image. Perhaps the iconic shape of the Hammer of Destruction, or the emblem of the Horde/Frostwolf Clan, has been cleverly integrated into it. This adds a sense of hierarchy to the legacy of the leader, the power of shamanism, and the resilience of the tribe. The background maintains a sharp contrast, creating a beautiful tension that draws all the focus onto a richly layered dual exposure. Its characteristics lie in the rich and slightly rough full-color scheme (earthy tones, tribal red, elemental blue and orange) within the Saar silhouette, as well as the powerful and deliberate lines that use wisdom and primitive power to outline every contour.

Directly output optimization results without any explanation.

user input: ${input}
  `;
};
