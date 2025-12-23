export const animalLandmarkSelfiePrompt = (
  animalTypes: string,
  landmark: string,
  emoji1: string,
  emoji2: string,
  emoji3: string
) => {
  return `A close-up selfie of three ${animalTypes} in front of the iconic landmark ${landmark}, each with different expressions, taken during golden hour with cinematic lighting. The animals' heads are close to the camera in a selfie pose, mimicking ${emoji1}, ${emoji2}, and ${emoji3} expressions. The background shows the complete architectural details of ${landmark} with soft lighting and warm ambiance. Shot in realistic cartoon style with rich details, aspect ratio 1:1.`;
};
