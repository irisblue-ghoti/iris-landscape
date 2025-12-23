export const colorSvgPrompt = (
  title: string,
  subtitle: string,
  content: string
) => {
  return {
    colorSvg: `
      Colorful summer vector art poster, ${content}. There is a large '${title}' title at the top, followed by a smaller '${subtitle}' title below
`,
  };
};

export const magzineCoverPrompt = (content: string, title: string) => {
  return {
    colorSvg: `
          ${content}. The photography style features high-definition details, similar to the cover design of fashion magazines. The text '${title}' is displayed at the top center of the photo. The background is a minimalist light gray solid color, designed to highlight the model.
    `,
  };
};

export const vintageCoverPrompt = (
  centerContent: string,
  mainTitle: string,
  leftBottom: string = "",
  rightBottom: string = "",
  language: string = "en",
  textAnnotation: string = ""
) => {
  return {
    colorSvg: `
          Retro promotional poster style, highlighting ${language} text, with a background of red and yellow radial patterns. The center position of the screen has ${centerContent}. The theme is ${mainTitle}, emphasizing ${textAnnotation}, with a prominent '${textAnnotation}' at the bottom, displaying or drawing ${rightBottom} in the bottom right corner, and ${leftBottom} in the bottom left corner.
    `,
  };
};
