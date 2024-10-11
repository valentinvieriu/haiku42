export function getPromptTemplate(haiku, haikuImagePrompts) {
    const haikuText = `${haiku.firstLine}${haiku.secondLine}${haiku.thirdLine}`;
    const hash = hashString(haikuText);
    const template = haikuImagePrompts[hash % haikuImagePrompts.length];
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
