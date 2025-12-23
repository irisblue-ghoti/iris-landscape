export const creativeDrawstringBagPrompt = (
  backgroundColor: string,
  itemsInBag: string,
  ribbonColor: string,
  labelColor: string,
  labelText: string
) => {
  return `
A high-resolution photo of a transparent plastic drawstring bag placed on a ${backgroundColor} background. Inside the bag are multiple tiny 3D ${itemsInBag} neatly arranged. The bag is tied with a soft ${ribbonColor} ribbon and has a ${labelColor} label attached to the opening, which reads "${labelText}". Soft lighting and clean shadows emphasize the realistic textures and details`;
};
