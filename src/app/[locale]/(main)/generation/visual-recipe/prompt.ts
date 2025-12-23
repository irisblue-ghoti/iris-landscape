export const handleDrawPrompt = (
  targetFood: string,
  ingredientList: string,
  cookingSteps: string
) => {
  return `
 Step by step recipe information diagram for ${targetFood}, top-down view, white background, simple hand drawn style, ingredient photo: ${ingredientList}, dashed line shows cooking steps and icon: ${cookingSteps}
  `;
};

export const handleRealPrompt = (
  targetFood: string,
  ingredientList: string,
  cookingSteps: string
) => {
  return `
  The step-by-step recipe information diagram of ${targetFood} features a top-down view, white background, simple layout, soft shadows, neat layout, and a modern minimalist feel. The ingredient photo is: ${ingredientList}, dotted line shows cooking steps and icon: ${cookingSteps}
  `;
};
