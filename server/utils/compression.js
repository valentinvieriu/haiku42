import { Buffer } from 'buffer';

export function compressHaiku(haiku) {
  const haikuString = JSON.stringify(haiku);
  const buffer = Buffer.from(haikuString, 'utf-8');
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decompressHaiku(compressedHaiku) {
  const base64 = compressedHaiku
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(compressedHaiku.length + (4 - compressedHaiku.length % 4) % 4, '=');
  
  const buffer = Buffer.from(base64, 'base64');
  const decompressed = buffer.toString('utf-8');
  return JSON.parse(decompressed);
}