export const clayModelImagePrompt = () => {
  return `
 Convert the image into a clay style, carving rough fingerprints, hand drawn flaws, and stains. Set in a three-dimensional model with soil texture and soft background, giving a tangible handmade feel.
  `;
};

export const clayModelTextPrompt = (content: string) => {
  return `
 A clay style ${content} carved with rough fingerprints, hand drawn flaws, and stains. Set in a three-dimensional model with soil texture and soft background, giving a tangible handmade feel.
  `;
};
