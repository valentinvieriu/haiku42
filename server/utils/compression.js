import LZString from 'lz-string';

/**
 * Compresses the haiku object using LZ-String.
 * @param {Object} haiku - The haiku object to compress.
 * @returns {string} - The compressed haiku ID.
 */
export function compressHaiku(haiku) {
  const haikuString = JSON.stringify(haiku);
  return LZString.compressToEncodedURIComponent(haikuString);
}

/**
 * Decompresses the haiku ID using LZ-String.
 * @param {string} compressedHaiku - The compressed haiku ID.
 * @returns {Object} - The decompressed haiku object.
 * @throws Will throw an error if decompression fails.
 */
export function decompressHaiku(compressedHaiku) {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressedHaiku);
    if (!decompressed) {
      throw new Error('Decompression returned null');
    }
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Failed to decompress haiku:', error.message);
    throw new Error('Failed to decompress haiku');
  }
}
