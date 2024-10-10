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
            prompt: prompt,
            width: 960,
            height: 1440,
            steps: 4,
            n: 1,
            response_format: "b64_json",
            seed: seed
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
                timeout: 30000 // 30 seconds timeout
            });

            if (response && response.data && response.data[0] && response.data[0].b64_json) {
                console.log('[TogetherProvider] Successfully generated image');
                return {
                    type: 'base64',
                    data: response.data[0].b64_json
                };
            } else {
                console.error('[TogetherProvider] Invalid response structure from Together API');
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
        const index = hash % haikuImagePrompts.length;
        const template = haikuImagePrompts[index];
        console.log('[TogetherProvider] Selected prompt template:', template);
        return template;
    }

    static generatePrompt(template, haiku) {
        const haikuText = `${haiku.firstLine} / ${haiku.secondLine} / ${haiku.thirdLine}`;
        const prompt = template.replace('{{haiku}}', haikuText);
        return prompt;
    }

    static generateSeed(template, haiku) {
        const haikuText = `${haiku.firstLine}${haiku.secondLine}${haiku.thirdLine}`;
        const combinedString = template + haikuText;
        const hash = this.hashString(combinedString);
        // Ensure the seed is between 1 and 10000
        return (hash % 10000) + 1;
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
    "Inspired by '{{haiku}}': Cyberpunk cityscape with holographic elements. Retro-futuristic and organic shapes blend. Digital dreamscape atmosphere.",
    "Visualizing the essence of '{{haiku}}': Virtual reality interface overlaying a natural landscape. Abstract data visualizations intertwine with organic elements.",
    "Interpreting '{{haiku}}' as a surreal digital collage mixing modern and classical elements. Glitchy textures and vibrant colors in a renaissance-style composition.",
    "Based on '{{haiku}}': AI-generated fractal patterns forming impossible architecture. Hidden cultural references scattered throughout.",
    "Minimalist tech-noir scene inspired by '{{haiku}}' with stark contrasts and deep shadows. Neon elements hint at underlying themes.",
    "Augmented reality nature scene reflecting '{{haiku}}'. Digital and natural elements blend seamlessly.",
    "Social media aesthetics inspired by '{{haiku}}' as abstract art. Profile elements form a complex tapestry. Emotions conveyed through color theory.",
  
    // Surreal and Unexpected
    "Interpreting '{{haiku}}' in an impossible space setting: Everyday objects take on cosmic significance. Subtle distortions create intrigue.",
    "Playful visualization of '{{haiku}}': Scale distortions with miniature and giant elements. Unexpected textures capture the essence.",
    "Inspired by the structure of '{{haiku}}': Impossible architecture with a modern twist. Abstract elements form visual puzzles.",
    "Climate change surrealism based on '{{haiku}}': Melting familiar objects juxtaposed with natural elements. Balancing beauty and concern.",
  
    // Emotional and Sensory
    "Synesthesia-inspired composition of '{{haiku}}': Colors represent sounds, textures evoke tastes. A sensory interpretation.",
    "Extreme close-up reflecting '{{haiku}}': Hyper-detailed and emotionally charged scene with complex reflections.",
    "Abstract emotional landscape of '{{haiku}}': Using color field techniques. Turbulent brushstrokes represent complex feelings expressed in the haiku.",
  
    // Pop Culture and Contemporary
    "Movie poster style composition featuring '{{haiku}}': Visual style derived from the haiku's theme with unexpected elements.",
    "Crowd scene inspired by '{{haiku}}': Individuals represented by symbolic elements. Stage and performers created from abstract concepts in the haiku.",
    "Classical art reimagined with '{{haiku}}': Traditional style with modern elements. Subtle contemporary references hidden throughout, based on the haiku's juxtaposition of ideas.",
  
    // Innovative and Experimental
    "Glitch art interpretation of '{{haiku}}': Distortions reveal layers of meaning. Visual elements represent the haiku's multiple interpretations.",
    "3D-rendered impossible object inspired by '{{haiku}}': Optical illusion effects based on the contradictions or surprises in the haiku.",
  
    // Traditional with a Modern Twist
    "Ink wash landscape inspired by '{{haiku}}': Traditional scene with subtle contemporary elements blending old and new.",
    "Traditional wave style representing '{{haiku}}': Modern elements caught in its form, blending natural and human-made concepts.",
    "Zen garden aesthetic based on '{{haiku}}': Traditional elements replaced by modern symbols. Patterns evoke both tradition and innovation.",
    "Seasonal imagery inspired by '{{haiku}}': Traditional style composed of unexpected materials. Delicate beauty meets contemporary consciousness.",
    
    // Additional Specific Prompts
    "Inspired by '{{haiku}}': A bustling marketplace where tradition meets innovation, showcasing diverse cultures and technologies.",
    "Visualizing '{{haiku}}' in an ethereal dreamscape where nature and machinery coexist harmoniously.",
    "Interpretation of '{{haiku}}' through a steampunk lens, merging Victorian aesthetics with futuristic inventions.",
    "Reflecting '{{haiku}}' in a minimalist art piece that emphasizes simplicity and profoundness.",
    "Depiction of '{{haiku}}' in a vibrant street festival, blending cultural festivities with modern artistic expressions."
];