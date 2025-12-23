export const coinImagePrompt = (year: string, bottomText: string) => {
  return `
Convert the uploaded image into a high-resolution photo of the gold coin with the main body of the image printed in the center. The top of the coin should be engraved with the year ${year}. Including intricate carvings, decorative border patterns, and authentic coin textures such as reed edges, matte backgrounds, and polished raised elements. Add the inscription '${bottomText}' in bold font near the bottom. The design should look like a professionally minted commemorative coin, with symmetrical layout, precise details, and classic metal shadows, presented on a dark background to create contrast.  `;
};

export const coinTextPrompt = (
  coinPattern: string,
  year: string,
  bottomText: string
) => {
  return `
A high-resolution photo of a gold coin with ${coinPattern} printed in the center. The top of the coin should be engraved with the year ${year}. This includes complex carvings, decorative border patterns, and authentic coin textures such as reed edges, matte backgrounds, and polished raised elements. Add bold font '${bottomText}' near the bottom. The design should look like a professionally minted commemorative coin, with symmetrical layout, precise details, and classic metal shadows, presented on a dark background to create contrast.
  `;
};
