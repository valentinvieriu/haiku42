import GPT4Service from './GPT4Service.js';
import GroqLlama3Service from './GroqLlama3Service.js';
import ClaudeService from './ClaudeService.js';
import DefaultCloudflareAIService from './DefaultCloudflareAIService.js';

export function getAIService(model, env) {
  switch (model) {
    case 'gpt-4o':
    case 'gpt-4o-mini':
      return new GPT4Service(env, model);
    case 'llama-3.2-11b-text-preview':
    case 'gemma2-9b-it':
      return new GroqLlama3Service(env, model);
    case 'claude-3-5-sonnet-20240620':
    case 'claude-3-opus-20240229':
    case 'claude-3-sonnet-20240229':
    case 'claude-3-haiku-20240307':
      return new ClaudeService(env, model);
    case 'cf-mistral':
    default:
      return new DefaultCloudflareAIService(env);
  }
}