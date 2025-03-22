import GPT4Service from './GPT4Service.js';
import GroqLlama3Service from './GroqLlama3Service.js';
import ClaudeService from './ClaudeService.js';
import DefaultCloudflareAIService from './DefaultCloudflareAIService.js';

export function getAIService(model, env) {
  switch (model) {
    case 'gpt-4.5-preview':
    case 'gpt-4o':
    case 'gpt-4o-mini':
      return new GPT4Service(env, model);
    case 'llama-3.3-70b-versatile':
    case 'llama-3.1-70b-versatile':
    case 'llama-3.1-8b-instant':
    case 'deepseek-r1-distill-llama-70b':
    case 'deepseek-r1-distill-qwen-32b':
    case 'gemma2-9b-it':
    case 'mistral-saba-24b':
      return new GroqLlama3Service(env, model);
    case 'claude-3-7-sonnet-20250219':
    case 'claude-3-5-sonnet-20241022':
      return new ClaudeService(env, model);
    case 'cf-mistral':
    default:
      return new DefaultCloudflareAIService(env);
  }
}