const styleTemplates = [
    // Sumi-e (ink wash painting)
    "Paint a sumi-e ink wash scene: {{imagePrompt}}. Black ink on rice paper, expressive brushstrokes, vast empty space, misty atmosphere, monochrome with subtle grey gradations.",
    "Create a sumi-e landscape: {{imagePrompt}}. Minimal bold brushstrokes, wet-on-wet ink technique, generous negative space, contemplative stillness, traditional East Asian ink painting.",
    "Illustrate in sumi-e style: {{imagePrompt}}. Single-stroke brushwork, ink splatter accents, fog and emptiness as composition elements, meditative simplicity.",

    // Ukiyo-e (woodblock prints)
    "Render as a Japanese ukiyo-e woodblock print: {{imagePrompt}}. Bold outlines, flat color fields, stylized waves and clouds, Hokusai-inspired composition, traditional indigo and earth tones.",
    "Create a ukiyo-e style scene: {{imagePrompt}}. Woodblock print aesthetic with crisp linework, layered flat colors, dramatic perspective, Hiroshige-inspired atmospheric depth.",
    "Illustrate as an Edo-period woodblock print: {{imagePrompt}}. Strong contour lines, limited color palette of indigo, vermillion, ochre, and moss green, decorative cloud patterns.",

    // Japanese watercolor
    "Paint a Japanese watercolor: {{imagePrompt}}. Soft wet washes bleeding into handmade paper, translucent layers, muted natural palette, wabi-sabi imperfections, delicate and luminous.",
    "Create a Japanese-inspired watercolor scene: {{imagePrompt}}. Pale washes with occasional vivid accents, visible paper texture, colors pooling at edges, poetic and understated.",
    "Illustrate in loose watercolor style: {{imagePrompt}}. Wet brushstrokes dissolving into white space, cherry blossom pinks and misty blues, spontaneous and airy composition.",

    // Zen / minimalist
    "Compose a zen minimalist scene: {{imagePrompt}}. Extreme simplicity, vast negative space, single focal element, muted earth tones, contemplative stillness, inspired by Japanese rock gardens.",
    "Create a ma-inspired composition: {{imagePrompt}}. Embrace emptiness as the primary element, sparse brushwork, quiet tension between presence and absence, monochrome palette.",

    // Washi paper / mixed traditional
    "Illustrate on textured washi paper: {{imagePrompt}}. Hand-painted quality with visible fiber texture, gold leaf accents, natural pigments, Rinpa school decorative elegance.",
    "Paint in the style of a Japanese screen painting: {{imagePrompt}}. Gold-flecked background, elegant natural forms, seasonal motifs, flowing composition across the frame, Rimpa aesthetic.",

    // Etegami (picture letters)
    "Create an etegami-style illustration: {{imagePrompt}}. Bold simple shapes, thick sumi ink outlines filled with vibrant watercolor, charming naivety, handcrafted warmth on absorbent paper.",

    // Contemporary Japanese illustration
    "Illustrate in contemporary Japanese watercolor style: {{imagePrompt}}. Clean linework with soft color washes, gentle atmospheric perspective, modern subject through traditional technique, quiet elegance.",
    "Paint a modern sumi-e interpretation: {{imagePrompt}}. Traditional ink wash technique applied to contemporary scene, expressive calligraphic energy, balance of control and spontaneity.",
];

export function getPromptTemplate(haiku) {
    const haikuText = `${haiku.firstLine}${haiku.secondLine}${haiku.thirdLine}`;
    const hash = hashString(haikuText);
    const template = styleTemplates[hash % styleTemplates.length];
    return template;
}

export function generatePrompt(template, haiku) {
    return template.replace('{{imagePrompt}}', haiku.imagePrompt);
}

export function generateSeed(template, haiku) {
    const combinedString = template + haiku.imagePrompt;
    return (hashString(combinedString) % 10000) + 1;
}

export function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}
