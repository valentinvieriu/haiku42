export default class TogetherProvider {
    static async getImage(haiku, env) {
        const apiUrl = 'https://api.together.xyz/v1/images/generations';
        const promptTemplate = this.getPromptTemplate(haiku);
        const prompt = this.generatePrompt(promptTemplate, haiku);
        const seed = this.generateSeed(promptTemplate, haiku);

        console.log('[TogetherProvider] Generated prompt:', prompt);
        console.log('[TogetherProvider] Generated seed:', seed);

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
    "Cyberpunk cityscape inspired by '{{haiku}}'. Retro-futuristic and organic shapes blend. Digital dreamscape atmosphere.",
    "Virtual reality interface overlaying a natural landscape. Abstract data visualizations intertwine with organic elements inspired by '{{haiku}}'.",
    "A surreal digital collage inspired by '{{haiku}}' mixing modern and classical elements. Glitchy textures and vibrant colors in a renaissance-style composition.",
    "AI-generated fractal patterns forming impossible architecture, influenced by '{{haiku}}'. Hidden cultural references scattered throughout.",
    "Minimalist tech-noir scene with stark contrasts and deep shadows. Neon elements hint at underlying themes inspired by '{{haiku}}'.",
    "Augmented reality nature scene inspired by '{{haiku}}'. Digital and natural elements blend seamlessly.",
    "Social media aesthetics as abstract art, reflecting the essence of '{{haiku}}'. Profile elements form a complex tapestry. Emotions conveyed through color theory.",
  
    // Surreal and Unexpected
    "An impossible space setting inspired by '{{haiku}}' where everyday objects take on cosmic significance. Subtle distortions create intrigue.",
    "Scale distortions with miniature and giant elements, inspired by '{{haiku}}'. Unexpected textures capture the essence.",
    "Impossible architecture with a modern twist, influenced by '{{haiku}}'. Abstract elements form visual puzzles.",
    "Climate change surrealism based on '{{haiku}}' with melting familiar objects juxtaposed with natural elements. Balancing beauty and concern.",
  
    // Emotional and Sensory
    "Synesthesia-inspired composition based on '{{haiku}}': Colors represent sounds, textures evoke tastes. A sensory interpretation.",
    "Extreme close-up, hyper-detailed and emotionally charged scene inspired by '{{haiku}}' with complex reflections.",
    "Abstract emotional landscape using color field techniques inspired by '{{haiku}}'. Turbulent brushstrokes represent complex feelings.",
  
    // Pop Culture and Contemporary
    "Movie poster style composition inspired by '{{haiku}}' with visual elements derived from thematic concepts.",
    "Crowd scene inspired by '{{haiku}}' with individuals represented by symbolic elements. Stage and performers created from abstract concepts.",
    "Classical art reimagined with modern elements, inspired by '{{haiku}}'. Subtle contemporary references hidden throughout.",
  
    // Innovative and Experimental
    "Glitch art interpretation inspired by '{{haiku}}' with distortions revealing layers of meaning. Visual elements represent multiple interpretations.",
    "3D-rendered impossible object inspired by '{{haiku}}' with optical illusion effects based on contradictions or surprises.",
  
    // Traditional with a Modern Twist
    "Ink wash landscape inspired by '{{haiku}}' with subtle contemporary elements blending old and new.",
    "Traditional wave style representing concepts from '{{haiku}}' with modern elements caught in its form, blending natural and human-made ideas.",
    "Zen garden aesthetic inspired by '{{haiku}}' with traditional elements replaced by modern symbols. Patterns evoke both tradition and innovation.",
    "Seasonal imagery inspired by '{{haiku}}' with traditional style composed of unexpected materials. Delicate beauty meets contemporary consciousness.",
  
    // New Contemporary and Futuristic Prompts
    "Neon-lit skyline reflecting the mood of '{{haiku}}', blending technology with natural elements.",
    "Futuristic marketplace inspired by '{{haiku}}', featuring diverse cultures and advanced gadgets.",
    "Smart cityscape influenced by '{{haiku}}', showcasing sustainable architecture and vibrant streets.",

    // New Surreal and Unexpected Prompts
    "Dreamlike forest scene inspired by '{{haiku}}', where trees morph into abstract shapes.",
    "Surreal underwater city reflecting the essence of '{{haiku}}', with ethereal lighting and fluid movements.",
    "Floating islands inspired by '{{haiku}}', interconnected by whimsical bridges and mystical flora.",

    // New Emotional and Sensory Prompts
    "Twilight landscape capturing the serenity of '{{haiku}}', with soft hues and gentle silhouettes.",
    "Emotionally charged storm scene inspired by '{{haiku}}', featuring dynamic clouds and intense colors.",
    "Calm lakeside view reflecting the tranquility of '{{haiku}}', with mirrored water and subtle lighting.",

    // New Pop Culture and Contemporary Prompts
    "Urban street art inspired by '{{haiku}}', blending graffiti styles with poetic elements.",
    "Concert scene reflecting the energy of '{{haiku}}', with vibrant lights and dynamic movements.",
    "Modern workspace inspired by '{{haiku}}', showcasing innovative designs and collaborative spaces.",

    // New Innovative and Experimental Prompts
    "Abstract geometric patterns inspired by '{{haiku}}', creating a visually engaging composition.",
    "Experimental light play reflecting the themes of '{{haiku}}', with shadows and vibrant beams.",
    "Mixed media collage inspired by '{{haiku}}', combining digital and traditional art elements.",

    // New Traditional with a Modern Twist Prompts
    "Traditional tea ceremony scene infused with modern aesthetics inspired by '{{haiku}}'.",
    "Classic garden landscape reimagined with contemporary art elements reflecting '{{haiku}}'.",
    "Heritage architecture blended with futuristic designs inspired by '{{haiku}}'.",

    // Add more prompts as needed...
];