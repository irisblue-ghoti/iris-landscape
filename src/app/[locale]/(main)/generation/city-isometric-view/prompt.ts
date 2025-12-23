export const cityIsometricViewPrompt = (
  city: string,
  weather: string,
  weatherEffect: string
) => {
  return `
The isometric miniature model view of ${city} enclosed within the profile box, viewed from a clean 45 ° angle from top to bottom. ${weather} Weather effects are cleverly integrated into the scene, ${weatherEffect} interact softly with the city above. The foundation of a city should appear thin and small, focusing on urban structures with more refined and less obvious foundations. Physics based rendering (PBR), realistic lighting. Ready to use solid color background, clear and minimalist. Centered composition emphasizes the aesthetic of precise and exquisite three-dimensional models.
  `;
};
