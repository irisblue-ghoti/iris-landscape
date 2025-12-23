export const handDrawnInfoCardPrompt = (input: string) => {
  return `
Create a hand drawn style infographic card with a vertical scale of 9:16. The card theme is distinct, with a beige or off white background with a paper texture, and the overall design embodies a simple and friendly hand drawn beauty. Above the card, the title is highlighted in a large, contrasting red and black brush and cursive font, attracting visual attention. The text content is written in Chinese cursive script, and the overall layout is divided into 2 to 4 clear sections, each section expressing the core points with short and concise Chinese phrases. The font maintains the smooth rhythm of cursive script, which is both clear and artistic. The cards are adorned with simple and interesting hand drawn illustrations or icons, such as characters or symbolic symbols, to enhance visual appeal and stimulate readers' thinking and resonance. The overall layout should pay attention to visual balance, reserve sufficient blank space, ensure that the picture is concise and clear, easy to read and understand.
User input content:
${input}
  `;
};
