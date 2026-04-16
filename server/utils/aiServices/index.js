import AnthropicProvider  from './AnthropicProvider.js';
import OpenAIProvider     from './OpenAIProvider.js';
import GroqProvider       from './GroqProvider.js';
import GoogleProvider     from './GoogleProvider.js';
import OllamaProvider     from './OllamaProvider.js';
import CloudflareProvider from './CloudflareProvider.js';

const PROVIDERS = [
  AnthropicProvider,
  OpenAIProvider,
  GroqProvider,
  GoogleProvider,
  OllamaProvider,
  CloudflareProvider,
];

const MODEL_TO_PROVIDER = new Map(
  PROVIDERS.flatMap((P) => P.models.map((m) => [m, P]))
);

// Legacy logical name → real model id. Currently only `cf-mistral`.
const MODEL_ALIASES = Object.freeze({
  'cf-mistral': '@cf/mistral/mistral-7b-instruct-v0.1',
});

export function getAIService(model, env) {
  const resolved = MODEL_ALIASES[model] ?? model;
  const Provider = MODEL_TO_PROVIDER.get(resolved);
  // Preserve current default-fallthrough: unknown strings → Cloudflare with its own default.
  if (!Provider) return new CloudflareProvider(env);
  return new Provider(env, resolved);
}

export { chains } from './chains.js';
