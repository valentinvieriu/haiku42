import LexicaProvider     from './LexicaProvider.js';
import StaticProvider     from './StaticProvider.js';
import CloudflareProvider from './CloudflareProvider.js';
import OllamaProvider     from './OllamaProvider.js';
import TogetherProvider   from './TogetherProvider.js';
import ReplicateProvider  from './ReplicateProvider.js';

const PROVIDERS = [
  LexicaProvider,
  StaticProvider,
  CloudflareProvider,
  OllamaProvider,
  TogetherProvider,
  ReplicateProvider,
];

const MODEL_TO_PROVIDER = new Map(
  PROVIDERS.flatMap((P) => P.models.map((m) => [m, P]))
);

/**
 * Resolve an image-provider id to a provider instance.
 * Unknown ids fall through to the terminal StaticProvider so callers can
 * always rely on a non-throwing chain.
 */
export function getImageProvider(model, env) {
  const Provider = MODEL_TO_PROVIDER.get(model);
  if (!Provider) return new StaticProvider(env);
  return new Provider(env, model);
}

export { chains } from './chains.js';
