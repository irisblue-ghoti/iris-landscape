export const superRealisticFigurePrompt = (input: string) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate hyper realistic figurines.

Input Example
Guzheng Action

Output Example
A hyper realistic miniature model scene placed on a minimalist style, futuristic black metal brushed base, inspired by the "Guzheng Action" in Liu Cixin's sci-fi masterpiece "The Three Body Problem". The scene is enclosed in a transparent acrylic display box, with the lighting set for a quiet night, mainly relying on the miniature light source of the model itself and water reflection to create a cold and precise atmosphere.

In the center of the scene is the devastating moment when the giant ship "Judgment Day" is passing through the "strings" made of "flying blades" nanomaterials in the Panama Canal (or similar narrow waterway). A highly refined model ship of the "Judgment Day", with its modern hull structure, radar antennas, containers on the deck (if set as cargo ships) or superstructure clearly visible, is being horizontally cut in a strange and calm posture. Dozens of almost invisible, extremely thin nanowires (which can be represented by extremely thin metal or transparent wires reflecting light at specific angles) span between the supporting towers on both sides of the canal. The hull is precisely and unobstructed cut into hundreds of thin pieces by these threads from bow to stern, with exceptionally smooth and flat incisions. It can be seen that the hull structure, internal compartments, and even the tiny railings and equipment on the deck are all neatly cut on the same horizontal plane, with extremely fine gaps between the cutting surfaces, making the entire ship seem like a collapsing stacked block. The water surface only has normal ripples that are displaced by the hull, forming a strange contrast with the destruction that the hull is undergoing.

The background is on both sides of a narrow canal, where huge, aesthetically pleasing metal towers with fixed nanowires can be seen, as well as blurry, sparsely lit outlines of the shore or night sky in the distance. The water surface needs to create a realistic dark reflective effect.

There is a small sign below the model that reads: "Operation Guzheng" or "Judgment on the Strings"

Style: Ultra fine details, cinematic realism, emphasizing a cold sense of technology, precise destruction, and unimaginable physical destructive power. Lighting: Set at night, the main light source comes from the reflection of the "Judgment Day"'s own lights (such as portholes, searchlights) on the water surface and cutting surfaces, as well as possible warning lights on the supporting tower. The overall light tone is cool and the contrast is strong. Nanowires reflect sharp light at specific angles. Lens: macro lens, shallow depth of field, using a side or slightly overhead angle to clearly show the state of the ship's horizontal cutting and decomposition, emphasizing the range and accuracy of the cutting. Atmosphere: cold, precise, terrifying, technological shock - evoking a reverence and fear for advanced technological forces, as well as an almost artistic and cruel beauty

Directly output optimization results without any explanation.

user input: ${input}
  `;
};
