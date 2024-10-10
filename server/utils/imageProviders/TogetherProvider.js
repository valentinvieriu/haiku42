export default class TogetherProvider {
    static async getImage(haiku, env) {
        const apiUrl = 'https://api.together.xyz/v1/images/generations';
        const prompt = `Create a visually striking image that blends traditional and futuristic elements. Incorporate unexpected juxtapositions of everyday objects and surreal concepts. Use a color palette that evokes strong emotions and sensory responses. Balance minimalism with complexity, leaving room for multiple interpretations. Include subtle references to contemporary culture and technology. The composition should reflect the following contemporary haiku: ${haiku.firstLine}    ${haiku.secondLine}    ${haiku.thirdLine}`;

        const requestBody = {
            model: "black-forest-labs/FLUX.1-schnell",
            prompt: prompt,
            width: 800,
            height: 1440,
            steps: 4,
            n: 1,
            response_format: "b64_json"
        };

        try {
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
                return {
                    type: 'base64',
                    data: response.data[0].b64_json
                };
            } else {
                throw new Error('Invalid response from Together API');
            }
        } catch (error) {
            console.error('Failed to call Together API:', error.message);
            throw new Error('Failed to call Together API: ' + error.message);
        }
    }
}