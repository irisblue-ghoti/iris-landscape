export const passportStampPrompt = (
  city: string,
  country: string,
  landmarks: string,
  date: string
) => {
  return `
Create a realistic passport page and stamp it with the entry stamp of [${city}, ${country}]. The seal should be written in bold English as "Welcome to ${city}" and designed in a circular or oval shape with decorative borders. The seal should include the words "ARRIVAL" and a fictional date, such as "${date}". Add subtle contours of ${landmarks} as background details in the chapter. Use dark blue or red ink with slight blending to enhance realism. The surface of the seal should be slightly tilted, as if it were hand pressed. Passport pages should have clear and visible paper textures and security patterns.
  `;
};
