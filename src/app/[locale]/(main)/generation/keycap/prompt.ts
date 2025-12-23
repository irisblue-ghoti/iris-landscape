export const coldColorPrompt = (
  mainKey: string,
  surroundingKeys: string,
  internalScene: string,
  sceneDescription: string
) => {
  return `
The realistic ${mainKey} keycap scene showcases a miniature and comfortable ${internalScene} setting. Internal: ${sceneDescription}, External: Cold technology blue is reflected on the surrounding buttons ${surroundingKeys}.The word '${mainKey}' cleverly appears in the glass fog at the top of the lid.
  `;
};

export const warmColorPrompt = (
  mainKey: string,
  surroundingKeys: string,
  internalScene: string,
  sceneDescription: string
) => {
  return `
A hyper realistic isometric 3D rendering depicting a miniature ${internalScene} located within a semi transparent mechanical keyboard keycap specially placed on the ${mainKey} keys of a real matte surface mechanical keyboard. Inside the keycap, ${sceneDescription}. The light inside the keycap imitates the natural morning sunlight, casting soft shadows and warm tones, while the outside reflects a cool toned environment from the surrounding keyboard. The word '${mainKey}' is cleverly etched on top of the semi transparent keycap with a faint frosted glass effect - only barely visible from an angle. The surrounding keyboard keys ${surroundingKeys} are clear, textured, and have photo realistic lighting. The shooting effect is like using a high-end mobile phone camera, with shallow depth of field, perfect white balance, and movie like details.
  `;
};
