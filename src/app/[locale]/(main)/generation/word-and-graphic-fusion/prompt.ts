export const wordAndGraphicFusionPrompt = (input: string) => {
  return `
Incorporate the meaning of words into letters and cleverly blend graphics and letters together.
Word: ${input}
Add a brief explanation of the words below
  `;
};
