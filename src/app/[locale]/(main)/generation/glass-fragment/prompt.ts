export const glassFragmentImagePrompt = () => {
  return `
Convert the uploaded image into a portrait of [4 or 5] irregularly shaped glass shards scattered on a textured gray white background. Each fragment displays complex details through light reflection, while the jagged glass edges with a slight green hue emphasize the image's disjointed and fragmented composition. The arrangement of fragments is meant to suggest a cohesive theme, rather than fully revealing it.  `;
};

export const glassFragmentTextPrompt = (subject: string) => {
  return `
Close up images capture the fragmented portrait of ${subject} by scattering [4 or 5] irregularly shaped glass shards on a textured gray white background. Each fragment displays complex details through light reflection, while the jagged glass edges with a slight green hue emphasize the image's disjointed and fragmented composition. The arrangement of fragments is meant to suggest a cohesive theme, rather than fully revealing it.

  `;
};
