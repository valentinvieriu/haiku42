export default class TogetherProvider {
    static async getImage(haiku, env) {
        const apiUrl = 'https://api.together.xyz/v1/images/generations';
        const promptTemplate = this.getPromptTemplate(haiku);
        const prompt = this.generatePrompt(promptTemplate, haiku);
        const seed = this.generateSeed(promptTemplate, haiku);

        console.log('[TogetherProvider] Generated prompt:', prompt);
        console.log('[TogetherProvider] Generated seed:', seed);

        //black-forest-labs/FLUX.1-schnell
        //black-forest-labs/FLUX.1-schnell-Free
        //black-forest-labs/FLUX.1.1-pro
        const requestBody = {
            model: "black-forest-labs/FLUX.1-schnell-Free",
            prompt,
            width: 960,
            height: 1440,
            steps: 4,
            n: 1,
            response_format: "b64_json",
            seed
        };

        try {
            console.log('[TogetherProvider] Sending request to Together API...');
            const response = await $fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                // timeout: 30000 // 30 seconds timeout
            });

            if (response?.data?.[0]?.b64_json) {
                console.log('[TogetherProvider] Successfully generated image');
                return {
                    type: 'base64',
                    data: response.data[0].b64_json
                };
            } else {
                throw new Error('Invalid response from Together API');
            }
        } catch (error) {
            console.error('[TogetherProvider] Failed to call Together API:', error.message);
            throw new Error('Failed to call Together API: ' + error.message);
        }
    }

    static getPromptTemplate(haiku) {
        const haikuText = `${haiku.firstLine}${haiku.secondLine}${haiku.thirdLine}`;
        const hash = this.hashString(haikuText);
        const template = haikuImagePrompts[hash % haikuImagePrompts.length];
        console.log('[TogetherProvider] Selected prompt template:', template);
        return template;
    }

    static generatePrompt(template, haiku) {
        return template.replace('{{imagePrompt}}', haiku.imagePrompt);
    }

    static generateSeed(template, haiku) {
        const combinedString = template + haiku.imagePrompt;
        return (this.hashString(combinedString) % 10000) + 1;
    }

    static hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
}

const haikuImagePrompts = [
    // Contemporary and Futuristic
    "Create an image with a cyberpunk aesthetic: {{imagePrompt}}. Use neon colors and high contrast.",
    "Design a surreal digital collage: {{imagePrompt}}. Blend modern and classical elements with glitchy textures.",
    "Visualize a minimalist tech-noir scene: {{imagePrompt}}. Emphasize stark contrasts and deep shadows.",
    "Illustrate an augmented reality nature scene: {{imagePrompt}}. Seamlessly blend digital and natural elements.",

    // Surreal and Unexpected
    "Depict an impossible space setting: {{imagePrompt}}. Play with scale and perspective to create intrigue.",
    "Create a climate change surrealism piece: {{imagePrompt}}. Balance beauty with environmental concern.",

    // Emotional and Sensory
    "Compose a synesthesia-inspired image: {{imagePrompt}}. Use colors to represent sounds and textures to evoke tastes.",
    "Paint an abstract emotional landscape: {{imagePrompt}}. Use color field techniques and turbulent brushstrokes.",

    // Pop Culture and Contemporary
    "Design a movie poster style composition: {{imagePrompt}}. Incorporate unexpected elements related to the theme.",
    "Illustrate a crowd scene with symbolic elements: {{imagePrompt}}. Represent individuals through abstract concepts.",

    // Innovative and Experimental
    "Create a glitch art interpretation: {{imagePrompt}}. Use distortions to reveal layers of meaning.",
    "Design a 3D-rendered impossible object: {{imagePrompt}}. Incorporate optical illusion effects.",

    // Traditional with a Modern Twist
    "Paint an ink wash landscape with contemporary elements: {{imagePrompt}}. Blend old and new aesthetics.",
    "Illustrate a zen garden with modern symbols: {{imagePrompt}}. Evoke both tradition and innovation.",

    // Additional Specific Styles
    "Create an ethereal dreamscape: {{imagePrompt}}. Use soft, misty colors and blurred edges.",
    "Design a vibrant street festival scene: {{imagePrompt}}. Blend cultural festivities with modern artistic expressions.",
    "Illustrate a retro-futuristic cityscape: {{imagePrompt}}. Combine vintage aesthetics with futuristic elements.",
    "Compose a minimalist art piece emphasizing simplicity: {{imagePrompt}}. Use negative space effectively.",
    "Create a steampunk-inspired scene: {{imagePrompt}}. Merge Victorian aesthetics with futuristic inventions.",
];