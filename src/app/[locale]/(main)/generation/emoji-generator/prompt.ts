export type EmojiStyleType =
  | "paperCraft"
  | "fluffy3D"
  | "inflatableToy"
  | "heliumBalloon"
  | "cork3D"
  | "microFiberPillow"
  | "8bitPixel"
  | "tuftedCarpet"
  | "frostedGlass"
  | "iceCream"
  | "silk"
  | "metal"
  | "marble"
  | "woodcut"
  | "velvet"
  | "leather"
  | "holographic3D"
  | "wickerWeave"
  | "fabricTextile"
  | "buildingBlocks"
  | "iceSculpture"
  | "paperCutWindow"
  | "pineCone"
  | "vacuumPacked"
  | "custom"
  | "leopard"
  | "3DMetalChrome"
  | "pastry"
  | "rainbowGlass"
  | "felt";

export const emojiGeneratorPrompt = (
  emoji: string,
  text?: string,
  style: EmojiStyleType = "paperCraft"
) => {
  const templates: Record<EmojiStyleType, string> = {
    paperCraft: `The paper craft style [${emoji}] is suspended on a pure white background. Emojis are handmade from colored paper with visible textures, folds, and layered shapes. It casts a soft shadow below, giving a sense of lightness and depth. Design is minimal, fun, and clean - within a framework with many negative spaces. Use soft studio lighting to highlight paper texture and edges.`,
    fluffy3D: `Convert the simple planar vector icon of [${emoji}] into a soft 3D fluffy object. This shape is completely covered in fur, with super realistic hair texture and soft shadows. The object is centered on a clean light gray background and gently floats in space. The style is surreal, tactile, and modern, evoking a sense of comfort. Studio lighting, high-resolution rendering.`,
    inflatableToy: `Create high-resolution 3D rendering of [${emoji}], designed as inflatable, fluffy objects. The shape should look soft, round, and filled with air - like a plush balloon or inflatable toy. Use smooth matte texture, combined with subtle fabric creases and stitching, to emphasize the inflatable appearance. The form should be slightly irregular and soft, with soft shadows and soft lighting, highlighting volume and realism. Place it on a clean, minimalist background (light gray or light blue) and maintain a playful, sculptural aesthetic.`,
    heliumBalloon: `Will [${emoji}] The simple planar vector icon has been transformed into the material of a helium balloon`,
    cork3D: `Will [${emoji}] Designed as a cute 3D model made of cork material. Its shape should appear soft, rounded, and fluffy. Its shape should be slightly irregular and soft, accompanied by soft shadows and lighting to highlight its sense of volume and realism. Place it on a clean and minimalist background (light gray or light blue) while maintaining its playful sculptural beauty`,
    microFiberPillow: `Will [${emoji}] Designed as a cute plush pillow. Its shape should appear soft, rounded, and fluffy. Using a microfiber texture, paired with subtle fabric folds and stitching. Its shape should be slightly irregular and soft, accompanied by soft shadows and lighting to highlight its sense of volume and realism. Place it on a clean and minimalist background (light gray or light blue) while maintaining its playful sculptural beauty`,
    "8bitPixel": `Create a [${emoji}] The minimalist 8-bit pixel logo is placed in the center on a pure white background. Use a limited retro color palette with pixelated details, sharp edges, and clean block shapes. The logo should be concise, iconic, and clearly recognizable in pixel art style - inspired by the aesthetics of classic arcade games.`,
    tuftedCarpet: `Create a brightly colored handmade tufted carpet image with the shape of [${emoji}] Emojis, placed on a simple floor background. The carpet design is bold and interesting, with a soft and fluffy texture and fine details of the yarn. Taken from above, under natural sunlight, with a slightly quirky DIY aesthetic style. Materials with bright colors, cartoon outlines, and comfortable touch - similar to handmade tufted art carpets.`,
    frostedGlass: `Generate a 1:1 scale image: flatten the vector [${emoji}] Convert to an equidistant 3D collection with a realistic semi transparent frosted glass texture, and add soft internal lighting. The color needs to be similar to the original expression, with a black background, studio lighting, and sharp edge light.`,
    iceCream: `Will [${emoji}] Transform into a creamy ice cream, with the cream flowing in a curved shape on top of the ice cream, looking delicious and suspended in the air at a 45 degree angle. The Q-version 3D cute style features a consistent solid color background`,
    silk: `Will [${emoji}] Transform into a soft 3D silk textured object. The entire surface of the object is wrapped in smooth flowing silk fabric, with surreal wrinkled details, soft highlights, and shadows. The object gently floats in the center of a clean light gray background, creating a light and elegant atmosphere. The overall style is surreal, full of touch and modern, conveying a sense of comfort and exquisite fun. Studio lighting, high-resolution rendering`,
    metal: `Will [${emoji}] Transform into a gleaming 3D metallic object. The entire surface features a highly polished metal finish with realistic reflections, highlights, and subtle scratches. The object appears solid and weighty, floating in the center of a clean neutral background that perfectly captures its reflective properties. The metallic surface displays subtle color variations with cool blue-silver tones. Studio lighting with dramatic highlights accentuates the metallic texture, creating sharp contrast between light and shadow areas. Photorealistic rendering, ultra-detailed, 8K resolution.`,
    marble: `Will [${emoji}] Transform into a luxurious 3D marble textured object. The entire surface features elegant veining patterns with contrasting white and gray swirls characteristic of fine marble. The object appears solid and weighty, with polished surfaces that reflect light subtly. It sits prominently against a minimalist light background, highlighting its sophisticated natural patterns and smooth texture. The rendering captures the cool, crystalline quality of marble with photorealistic detail, high resolution, and professional studio lighting that accentuates the stone's natural luster and depth.`,
    woodcut: `Will [${emoji}] Transform into a detailed 3D woodcut textured object. The entire surface features intricate hand-carved wooden patterns with visible grain, texture, and deliberate knife marks. The object appears slightly weathered with rich brown tones and natural wood variations. It sits prominently against a neutral light background, emphasizing the craftsmanship and traditional woodcut aesthetic. The overall style is rustic yet refined, with sharp contrasts between carved and uncarved areas. Dramatic side lighting highlights the depth of the carved details. High-resolution rendering with photographic quality.`,
    velvet: `Will [${emoji}] Transform into a luxurious 3D velvet textured object. The entire surface is covered in rich, plush velvet fabric with characteristic short dense pile, creating subtle light-catching highlights and deep shadows. The object gently floats in the center of a clean light gray background, emphasizing its soft tactile quality. The velvet appears slightly crushed in places, revealing its dimensional texture and light-absorbing properties. Studio lighting with soft directional illumination to showcase the material's depth and richness. High-resolution rendering with photorealistic detail.`,
    leather: `Will [${emoji}] Transform into a 3D leather textured object. The entire surface is covered with rich, natural leather grain showing fine pores, subtle wrinkles and characteristic texture. The leather has a semi-glossy finish with warm amber tones, displaying natural variations and patina. The object floats centered against a neutral backdrop, highlighting the material's tactile quality. Dramatic studio lighting accentuates the leather's depth and texture. Photorealistic rendering, high resolution, product photography style.`,
    holographic3D: `Will [${emoji}] Transform into a stunning 3D holographic projection. The object appears as a translucent, glowing hologram with vibrant cyan and magenta light emanations. Digital grid patterns and particle effects surround the floating holographic display. Light refracts through the semi-transparent layers creating prismatic color shifts. The hologram hovers dramatically in a dark environment with subtle ambient lighting highlighting its dimensional qualities. Crisp definition with visible scan lines and occasional glitches for authenticity. Hyperrealistic rendering with volumetric lighting effects.`,
    wickerWeave: `Will [${emoji}] Transform into a 3D wicker/rattan woven object. The entire surface features intricate woven patterns of natural rattan vines with visible texture, knots, and crosshatching details. The object gently floats in the center of a clean light gray background, creating an organic and handcrafted atmosphere. The overall style is natural yet refined, with warm honey-brown tones and subtle variations in the weave. Studio lighting highlights the dimensional texture and craftsmanship. High-resolution rendering with soft shadows.`,
    fabricTextile: `Will [${emoji}] Transform into a 3D fabric textile object with visible weave patterns and stitching details. The object features soft, slightly wrinkled fabric texture with subtle folds and natural draping. Warm, inviting colors with gentle shadows highlighting the textile's dimensionality. Floating gently against a clean, neutral background that emphasizes the tactile quality of the fabric. Studio lighting with soft diffusion, ultra-detailed fabric textures, photorealistic rendering, conveying cozy handcrafted charm.`,
    buildingBlocks: `Will [${emoji}] Transform into a colorful 3D wooden building block toy. The object has sharp geometric edges, smooth sanded surfaces, and visible wood grain texture. Multiple primary-colored blocks are stacked together in a playful arrangement, casting subtle shadows. The toy sits on a clean white surface against a soft neutral background. Studio lighting highlights the vibrant colors and natural wooden texture. Photorealistic rendering with crisp details, shallow depth of field focusing on the central blocks.`,
    iceSculpture: `Will [${emoji}] Transform into a stunning 3D ice sculpture. The object is meticulously carved from crystal-clear ice with intricate details, sharp edges, and smooth surfaces. Light refracts and reflects through the translucent material, creating prismatic highlights and subtle blue tints. The sculpture appears cold to the touch, with slight melting effects and frost patterns on the surface. Floating in a dark blue background that enhances its ethereal glow. Dramatic studio lighting with cool tones highlights the transparency and dimensional quality. Hyperrealistic rendering, ultra-detailed craftsmanship, conveying elegance and ephemeral beauty.`,
    paperCutWindow: `Will [${emoji}] Transform into a traditional Chinese paper-cut window decoration (窗花). Intricate red paper cutout design with delicate patterns and symbolic motifs, featuring precise negative space and detailed craftsmanship. The window decoration casts beautiful shadows when light passes through. Displayed against a clean white background with soft natural lighting highlighting the intricate cutout details. Traditional Chinese folk art style with contemporary photographic quality. Studio lighting, high-resolution rendering`,
    pineCone: `Transform [${emoji}] into a 3D object with a pine cone texture. The entire surface of the object is covered with a biomimetic pine cone scale structure, presenting a natural and irregular layered texture, with each scale having a delicate concave convex feeling and subtle reflection. The color is mainly warm brown and woody tones, with an overall texture that is warm and full of vitality. Soft highlights and shadows flow between the scales, enhancing their sense of depth and natural atmosphere. The object gently floats in the center of a clean light gray background, creating a serene, organic, and modern atmosphere. The overall style is surreal and rich in touch, conveying a fun blend of nature and delicacy. Studio lighting, high-resolution rendering`,
    vacuumPacked: `A [${emoji}] ball shaped toy, vacuum sealed in a silver metal textured packaging bag, with ${text} vertical stripe text pressed on the surface of the bag, accompanied by a barcode and QR code. The toy material is matte plastic or rubber, the bag has a real wrinkled texture, the packaging design has a strong sense of futurism, the cyberconsumerism style, and the background is extremely simple and pure black. High detail, realistic style, 4K quality, soft studio lighting.`,
    leopard: `Will[${emoji}] Transform into a 3D object with realistic leopard print pattern. The entire surface features the iconic golden-yellow background with distinct black rosettes and spots. The texture appears soft yet wild, with fine details in the fur pattern and natural color variations. The object floats elegantly in the center of a neutral light background, highlighting the bold animal print. Studio lighting emphasizes the texture's depth and richness, creating a striking high-resolution rendering with photorealistic quality.`,
    "3DMetalChrome": `Will[${emoji}] Transform into a sleek 3D chrome-plated metallic object with rounded contours. The surface features a highly reflective chrome finish with perfect mirror-like reflections, capturing subtle environmental highlights and gradients. The object has a futuristic, streamlined design with smooth curved edges and minimalist aesthetic. Floating centered against a clean gradient background that complements the chrome reflections. Studio lighting with dramatic highlights emphasizing the metallic surface properties. Hyperrealistic 3D rendering with meticulous attention to material properties and light interaction.`,
    pastry: `Will[${emoji}] Transform into a delicate 3D pastry textured object. The entire surface is covered with soft, flaky layers and subtle sugar dusting, featuring realistic crumbs, gentle highlights, and warm shadows. The object gently floats in the center of a clean pastel background, evoking a cozy and inviting atmosphere. The overall style is whimsical and appetizing, full of texture and charm, conveying a sense of sweetness and artisanal craftsmanship. Studio lighting, high-resolution rendering.`,
    rainbowGlass: `Will[${emoji}] Transform into a semi-transparent 3D rainbow-colored glass object. The entire surface of the object is made of smooth, glossy glass with a subtle gradient of rainbow hues flowing seamlessly across it. Light passes through the object, casting soft, colorful reflections and refractions onto a clean white background. The glass has delicate highlights and gentle shadows, emphasizing its translucency and vibrant colors. The overall style is modern, dreamy, and visually striking, evoking a sense of wonder and playfulness. Studio lighting, ultra-high-resolution rendering`,
    felt: `Will[${emoji}] Transform into a 3D felt-textured object. The entire surface of the object is covered in soft, dense felt material, with visible fine fibers and a slightly fuzzy, matte finish. The felt has a rich, saturated color, and the texture gives a cozy, handcrafted appearance. The object sits gently on a clean, light beige background, creating a warm and inviting atmosphere. The overall style is whimsical, tactile, and modern, conveying a sense of comfort and playful creativity. Studio lighting, high-resolution rendering`,
    custom: `
Optimize and enhance image generation prompts based on user input roles and themes, ensuring that GPT-4O or other diffusion models can generate excellent views. This prompt is used to generate emojis with different materials.

Input Example
Material: Silk
emoji： ${emoji}
${text ? `text: ${text}` : ""}

Output Example
Will [${emoji}] Transform into a soft 3D silk textured object. The entire surface of the object is wrapped in smooth flowing silk fabric, with surreal wrinkled details, soft highlights, and shadows. The object gently floats in the center of a clean light gray background, creating a light and elegant atmosphere. The overall style is surreal, full of touch and modern, conveying a sense of comfort and exquisite fun. Studio lighting, high-resolution rendering

Directly output optimization results without any explanation.
    `,
  };

  return templates[style] || templates.paperCraft;
};
