export const cloudArtPrompt = (shape: string, location: string) => {
  return `
Generate a photorealistic image of a beautiful sky scene during daytime, where natural clouds have formed to visually resemble the shape of ${shape} (not text). The clouds should clearly outline the silhouette or form of ${shape}, floating above ${location}. The image should show a realistic landscape with these special cloud formations visible in the sky.
  `;
};
