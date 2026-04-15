# Haiku42

AI-powered haiku generator with matching background images. Generates contemporary 5-7-5 haikus using multiple AI providers and pairs them with AI-generated images.

**Live site:** haiku42.net

## Tech Stack

- **Framework:** Nuxt 3 (Vue 3 + Nitro server)
- **Styling:** TailwindCSS
- **Deployment:** Cloudflare Pages (with Workers AI binding)
- **Node:** 22.10.0

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Build + preview locally with Wrangler
npm run deploy       # Build + deploy to Cloudflare Pages
npm run cf-typegen   # Generate Cloudflare worker types
npm run generate-topics  # Regenerate topic list
```

## Project Structure

```
pages/
  index.vue              # Home - auto-generates haiku, redirects to /haiku/{id}
  haiku/[id].vue         # Main display page (haiku + background image)

components/
  HaikuDisplay.vue       # Haiku text with typewriter animation
  BackgroundImage.vue     # Background image with pan/zoom animations
  SkeletonHaiku.vue      # Loading placeholder

server/api/
  haiku.js               # POST: generate haiku | GET: fetch by compressed ID
  haiku-image.js         # GET: stream background image for a haiku

server/utils/
  haikuGenerator.js      # Core prompt + generation logic
  topics.js              # Weighted random topic generation (20+ categories)
  compression.js         # LZ-String compress/decompress for URL sharing

server/utils/aiServices/
  index.js               # Factory: getAIService(model, env) -> service
  ClaudeService.js       # Anthropic Codex API
  GPT4Service.js         # OpenAI API
  GroqLlama3Service.js   # Groq API (Llama, Qwen, DeepSeek models)
  OllamaService.js       # Local Ollama API (OpenAI-compatible, no auth)
  DefaultCloudflareAIService.js  # Cloudflare Workers AI (Mistral fallback)

server/utils/imageProviders/
  index.js               # Factory: getImageProvider(name) -> provider
  sharedPrompts.js       # 18 aesthetic prompt templates
  imageProviderUtils.js  # Deterministic prompt/seed generation from haiku hash
  CloudflareAIProvider.js    # Cloudflare Workers AI (FLUX Schnell)
  FluxSchnellProvider.js     # Replicate FLUX.1 Schnell
  FluxProProvider.js         # Replicate FLUX.1 Pro
  FluxRedCinemaProvider.js   # Replicate cinema-style
  TogetherProvider.js        # Together.ai (paid)
  TogetherFreeProvider.js    # Together.ai (free)
  GoogleImagen3Provider.js   # Google Imagen 3 via Replicate
  OllamaImageProvider.js     # Local Ollama diffusion models
  LexicaProvider.js          # Lexica.art image search
  DefaultProvider.js         # Static fallback image
```

## Architecture

### Fallback Chains

Both AI text and image generation use sequential fallback — try providers in order, use the first that succeeds:

- **Haiku generation:** Ollama (local) -> Groq models (Llama/Qwen) -> Codex -> GPT-4 -> Cloudflare Workers AI
- **Image generation:** Ollama (local) -> Replicate/Together/Cloudflare cloud providers -> static fallback

### Stateless URL Sharing

Haikus are not stored in a database. The entire haiku object is JSON-compressed via LZ-String and encoded as the URL parameter (`/haiku/{compressed-id}`). Same haiku always produces the same image (deterministic seeding from content hash).

### Service Interfaces

All AI services implement: `run(chatMessages) -> string`
All image providers implement: `getImage(haiku, env, width, height) -> {type, data}`

## Environment Variables

Local dev (Ollama):
```
OLLAMA_BASE_URL       # Ollama server URL (default: http://localhost:11434)
OLLAMA_IMAGE_MODEL    # Ollama image model (default: x/z-image-turbo:fp8)
```

Cloud providers (`.dev.vars` or Cloudflare dashboard):
```
GROQ_API_KEY          # Groq API
ANTHROPIC_API_KEY     # Codex API
OPENAI_API_KEY        # OpenAI API
REPLICATE_API_KEY     # Replicate (Flux, Imagen image providers)
TOGETHER_API_KEY      # Together.ai image provider
```

Optional/unused:
```
PERPLEXITY_API
OPENROUTER_API_KEY
NUXT_PUBLIC_TURNSTILE_SITE_KEY
NUXT_TURNSTILE_SECRET_KEY
```

## No Tests

There is no test suite. Verify changes by running the dev server and generating haikus manually.
