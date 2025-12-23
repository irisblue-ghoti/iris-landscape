export const monsterLetterPrompt = (
  lettersOrWords: string,
  colorTone: string,
  emotionalExpression: string
) => {
  return `
The 3D rendering of the word '${lettersOrWords}' is designed as a furry monster letter all over the body. Each letter shape is itself a biological body - without a separate head or limbs. Eyes, mouth, and other monster features are naturally embedded into the letter form. These letters have thick, soft, and realistic fur in order, with pure and vibrant tones:
${colorTone}

Each letter expresses a unique emotion through the eyes and mouth in order:
${emotionalExpression}
Studio lighting with subtle shadows on a smooth and soft background. Clean and personalized high-quality monster layout without accessories or props.
  `;
};
