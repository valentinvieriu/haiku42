export async function fetchLexicaImage(haiku) {
    let textResponse = `${haiku.firstLine} / ${haiku.secondLine} / ${haiku.thirdLine}`;
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
            searchMode:'images'
        }),
    };
    
    try {
        const response = await fetch('https://lexica.art/api/infinite-prompts', lexicaInit);
        const responseData = await response.json();
        
        // console.log('Lexica API Response:', responseData); // Added logging

        if (responseData && responseData.images && responseData.images.length > 0) {
            console.log('Image found:', responseData.images[0].id); // Log the found image ID
            return responseData.images[0].id;
        } else {
            console.error('No images found in Lexica response'); // Enhanced error logging
            throw new Error('No images found in Lexica response');
        }
    } catch (error) {
        console.error('Failed to Call Lexica API:', error.message); // Enhanced error logging
        throw new Error('Failed to Call Lexica API: ' + error.message);
    }
}