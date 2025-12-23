export const originalProductImagePrompt = (input: string) => {
  return `
Directly generate original product images to avoid copyright issues.

The product name or description entered by the user:

user input: ${input}
  `;
};
