import GoogleProvider from './GoogleProvider.js';
import OllamaProvider from './OllamaProvider.js';

const PROVIDERS = [GoogleProvider, OllamaProvider];

const MODEL_TO_PROVIDER = new Map(
  PROVIDERS.flatMap((P) => P.models.map((m) => [m, P]))
);

export function getAIService(model, env) {
  const Provider = MODEL_TO_PROVIDER.get(model);
  if (!Provider) throw new Error(`Unknown AI model: ${model}`);
  return new Provider(env, model);
}

export { chains } from './chains.js';
