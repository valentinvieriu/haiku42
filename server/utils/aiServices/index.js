import GPT4oService from './GPT4oService.js';
import GroqLlama3Service from './GroqLlama3Service.js';
import ClaudeService from './ClaudeService.js';
import NousHermesService from './NousHermesService.js';
import DefaultCloudflareAIService from './DefaultCloudflareAIService.js';

export function getAIService(model, env) {
  switch (model) {
    case 'gpt-4o':
      return new GPT4oService(env);
    case 'llama-3.2-11b-text-preview':
      return new GroqLlama3Service(env, model);
    case 'claude-3-5-sonnet-20240620':
      return new ClaudeService(env);
    case 'nous-hermes':
      return new NousHermesService(env);
    case 'cf-openhermes':
      return new NousHermesService(env); // Assuming similar implementation
    case 'cf-mistral':
    default:
      return new DefaultCloudflareAIService(env);
  }
}