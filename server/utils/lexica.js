export async function fetchLexicaImage(haiku, topic) {
    const textResponse = `${topic}    ${haiku.firstLine}    ${haiku.secondLine}    ${haiku.thirdLine}`;
    
    const lexicaInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            text: textResponse,
            source: 'search',
            cursor: 0,
            model: 'lexica-aperture-v3.5',
            searchMode: 'images',
        }),
    };

    try {
        const response = await fetch('https://lexica.art/api/infinite-prompts', lexicaInit);
        const responseData = await response.json();

        if (responseData && responseData.images && responseData.images.length > 0) {
            const imageId = responseData.images[0].id;
            console.log('Image ID obtained:', imageId); // Optional: Retain or remove logging
            return imageId;
        } else {
            console.error('No images found in Lexica response');
            throw new Error('No images found in Lexica response');
        }
    } catch (error) {
        console.error('Failed to call Lexica API:', error.message);
        throw new Error('Failed to call Lexica API: ' + error.message);
    }
}