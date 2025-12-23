export const threeDHeadPoseImagePrompt = () => {
  return `
 Create 3D avatar poses with 8 different profiles/poses, different actions to maintain character consistency, 16:9 aspect ratio.
  `;
};

export const threeDHeadPoseTextPrompt = (content: string) => {
  return `
 Create a 3D avatar pose with 8 different contours/poses and actions based on the user's input character description to maintain character consistency, with a 16:9 aspect ratio.

User inputted role description:
${content}
  `;
};
