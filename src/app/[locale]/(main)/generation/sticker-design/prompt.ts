export const uploadImagePrompt = () => ({
  illustration: `Design the characters or other subjects in this image as a minimalist flat illustration style Q-version sticker with thick white borders, retaining the main features. The style should be cute, and the subject should extend beyond the circular area border. The circular area should be a solid color without a 3D feel, with a transparent background`,
  anime: `Design the characters or other subjects in this picture into an anime style sticker with thick white borders and a transparent background`,
});

export const textPrompt = (content: string) => ({
  illustration: `Design the input content as a minimalist flat illustration style Q-version sticker, with thick white borders and a cute style. The main body should extend beyond the circular area border, and the circular area should be a solid color without a 3D feel, with a transparent background

User input content:
${content}
`,
  anime: `Design the input content as anime style stickers with thick white edges and transparent backgrounds

User input content:
${content}
`,
});
