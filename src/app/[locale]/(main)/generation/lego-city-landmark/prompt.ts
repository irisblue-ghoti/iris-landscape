export const legoCollectionPrompt = (input: string) => {
  return `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate a city built by LEGO.


Input Example
City or attraction: Xi'an

Output example:
Create a LEGO style Xi'an Bell Tower Square scene full of details and vibrant colors. The clock tower is presented in an elegant traditional Chinese LEGO architecture, topped with gold and dark green LEGO tiles, surrounded by busy circular streets with numerous lifelike LEGO cars, buses, and bicycles. On both sides of the street, there are densely arranged shops and shopping malls made of Lego, with bright signs and clear Chinese characters. Lego kids are walking, taking photos, shopping, or resting and chatting on the streets, full of vitality. The background is set against a clear LEGO blue sky, a few floating LEGO clouds, and the elegant LEGO Qinling Mountains in the distance, creating a joyful and historically rich atmosphere.

Input Example
City or scenic spot: Yu Garden Old Street, Shanghai

Output example:
Create a Lego scene full of traditional charm in the old street of Yu Garden in Shanghai. The center of the screen is a traditional Chinese LEGO building carefully constructed with black and red LEGO bricks, such as the Huxin Pavilion and the Nine Curve Bridge, with clear and beautiful eaves and ridges. The lake under the bridge is built with transparent light blue LEGO bricks, and LEGO figures are watching or taking photos along the bridge. The old streets around are paved with red and brown Lego bricks, and there are detailed and realistic traditional shops on both sides, selling Lego versions of sugar paintings, soup bags, Xiaolongbao and special souvenirs. Red and yellow LEGO lanterns hang above the street, attracting a constant stream of LEGO tourists and residents, creating a lively and bustling scene. The background is accompanied by a bright LEGO blue sky and soft sunlight, creating a warm and human like overall picture.

User input format:
City or scenic spot: {{Lego built city scenic spot}}

Directly output optimization results without any explanation.

user input: ${input}
  `;
};
