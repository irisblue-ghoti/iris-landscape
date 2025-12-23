export const changeAgePrompt = (
  title: string,
  subtitle: string,
  accessories: string
) => {
  return `Draw a movable doll toy of the character in this photo. This image should be a complete image and displayed in the original blister packaging. At the top of the box are the names of the toys, '${title}' and '${subtitle}', spanning a line of text. In the vacuum packaging, the accessories of the toy are displayed next to the picture, including ${accessories}.`;
};
