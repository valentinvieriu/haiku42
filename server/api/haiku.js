import { generateHaiku } from '../utils/haikuGenerator';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { cloudflare } = event.context
  
  try {
    const haiku = await generateHaiku(cloudflare.env, query)
    return haiku
  } catch (error) {
    console.error('Error generating haiku:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error generating haiku',
      message: error.message
    })
  }
})