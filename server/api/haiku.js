import { generateHaiku } from '../utils/haikuGenerator';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { cloudflare } = event.context
  const haiku = await generateHaiku(cloudflare.env, new URLSearchParams(query));
  return haiku;
});
