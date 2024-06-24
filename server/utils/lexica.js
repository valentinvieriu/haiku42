async function gatherResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

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
        
        if (responseData && responseData.images && responseData.images.length > 0) {
            return responseData.images[0].id;
        } else {
            throw new Error('No images found in Lexica response');
        }
    } catch (error) {
        throw new Error('Failed to Call Lexica API: ' + error.message);
    }
}
