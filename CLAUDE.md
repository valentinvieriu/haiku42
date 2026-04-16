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
  topics.js              # Scene seed builder (8 modes, concrete micro-moments)
  compression.js         # LZ-String compress/decompress for URL sharing

server/utils/aiServices/
  index.js               # Registry: getAIService(model, env) -> provider instance
  chains.js              # Named fallback chains (streaming, cloud)
  AnthropicProvider.js   # Anthropic Claude API; exports ANTHROPIC_MODELS catalogue
  OpenAIProvider.js      # OpenAI API; exports OPENAI_MODELS catalogue
  GoogleProvider.js      # Google Gemini OpenAI-compat (Gemma 4, Gemini 3.1); exports GOOGLE_MODELS
  OllamaProvider.js      # Local Ollama API (OpenAI-compatible); exports OLLAMA_MODELS
  CloudflareProvider.js  # Cloudflare Workers AI (Mistral fallback); exports CLOUDFLARE_MODELS
  streamParser.js        # Shared SSE parser for OpenAI-compatible streams

server/utils/imageProviders/
  index.js               # Registry: getImageProvider(id, env) -> provider instance
  chains.js              # Named fallback chains (default)
  prompts.js             # Style templates + deterministic prompt/seed from haiku hash
  LexicaProvider.js      # Lexica.art image search
  OllamaProvider.js      # Local Ollama diffusion models
  StaticProvider.js      # Terminal fallback — static URL
```

Each provider file owns its model/preset catalogue as a frozen `*_MODELS` (or `*_PRESETS`) export. Chain definitions in `chains.js` reference these constants by name, so model strings live in exactly one place per provider.

## Architecture

### Fallback Chains

Both AI text and image generation use sequential fallback — try providers in order, use the first that succeeds:

- **Haiku generation:** Ollama (local) -> Google (Gemma/Gemini) -> Claude -> GPT-4 -> Cloudflare Workers AI
- **Image generation:** Lexica -> Ollama (local) -> static fallback

### Stateless URL Sharing

Haikus are not stored in a database. The entire haiku object is JSON-compressed via LZ-String and encoded as the URL parameter (`/haiku/{compressed-id}`). Same haiku always produces the same image (deterministic seeding from content hash).

### Provider Interfaces

All AI providers (text) implement: `run(chatMessages) -> string`. Optional: `runStream(chatMessages) -> AsyncIterable<{type, text}>` for streaming.
All image providers implement: `getImage(haiku, width, height) -> {type, data}` (env is in the constructor).
Each provider class exposes `static models` (its catalogue) and `static providerName` (short label).

## Environment Variables

Local dev (Ollama):
```
OLLAMA_BASE_URL       # Ollama server URL (default: http://localhost:11434)
OLLAMA_IMAGE_MODEL    # Ollama image model (default: x/z-image-turbo:fp8)
```

Cloud providers (`.dev.vars` or Cloudflare dashboard):
```
ANTHROPIC_API_KEY     # Claude API
OPENAI_API_KEY        # OpenAI API
GEMINI_API_KEY        # Google Gemini API (Gemma 4, Gemini 3.1)
```

Optional/unused:
```
PERPLEXITY_API
OPENROUTER_API_KEY
NUXT_PUBLIC_TURNSTILE_SITE_KEY
NUXT_TURNSTILE_SECRET_KEY
```

### Topic Generation (Scene Seed Builder)

`server/utils/topics.js` generates "scene seeds" — concrete, imageable micro-moments the LLM inhabits to write haiku. Key design decisions:

- **Modes, not categories**: 8 weighted families of moments (observation 30%, urban-nature 20%, human-trace 20%, domestic-turn 15%, climate-echo 10%, transit 10%, night-and-silence 10%, comic-glimpse 5%). Each mode owns coherent pools so random picks share a world.
- **Scene clusters for broad modes**: Modes spanning diverse physical spaces (human-trace, transit, night-and-silence) use scene clusters — sub-groupings where every entry is plausible in the same physical space. Composition picks a cluster first, then draws from within it.
- **Pools by poetic function**: `frames` (where/when), `anchors` (focal subject+action), `sensory` (sound/smell/touch/light), `traces` (human residue), `absences` (what's NOT there).
- **All concrete, all imageable**: Every element must work for both haiku text and image generation. No abstract nouns ("quiet joy", "climate grief"), no explanatory verbs ("reveals", "teaches", "versus"). Absences must also be imageable — "empty hook on the wall" not "the motivation that was there this morning".
- **Thematic steering through mode selection**: Choosing "climate-echo" naturally produces climate-adjacent imagery without naming the theme. No abstract metadata reaches the output.
- **Output format**: 2-5 semicolon-separated concrete clauses. Example: `"highway rest stop, 1am; headlights finding the deer's eyes, then not; engine vibration through the seat"`

When adding entries: be specific not generic ("a parking lot puddle" not "puddle"), include sensory detail, avoid haiku cliche vocabulary ("fleeting", "ephemeral", "serenity"), stay culturally broad. Every entry must pass the imageability test — can you picture it?

## No Tests

There is no test suite. Verify changes by running the dev server and generating haikus manually.
