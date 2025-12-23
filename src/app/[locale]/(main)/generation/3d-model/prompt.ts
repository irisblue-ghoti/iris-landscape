export const threeDModelPrompt = (
  model: string,
  bottomText: string,
  detailDescription: string
) => {
  return `
Creative composition, minimalist 3D model with ${model} theme ${detailDescription}. The black matte brackets at the bottom are marked with bold sans serif bronze text '${bottomText}', with a gradient background. Choose the appropriate theme.
  `;
};
