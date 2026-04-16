import GPT4Service from './GPT4Service.js';
import GroqLlama3Service from './GroqLlama3Service.js';
import ClaudeService from './ClaudeService.js';
import DefaultCloudflareAIService from './DefaultCloudflareAIService.js';
import OllamaService from './OllamaService.js';

export function getAIService(model, env) {
  switch (model) {
    case 'gemma4:e2b-it-q8_0':
    case 'gemma4:26b-mxfp8':
    case 'qwen3.5:27b-mxfp8':
    case 'gemma4:26b-a4b-it-q8_0':
    case 'gemma4:31b-mxfp8':
    case 'qwen3.5:122b-a10b-q4_K_M':
      return new OllamaService(env, model);
    case 'gpt-4.5-preview':
    case 'gpt-4o':
    case 'gpt-4o-mini':
      return new GPT4Service(env, model);
    case 'llama-3.3-70b-versatile':
    case 'llama-3.1-70b-versatile':
    case 'llama-3.1-8b-instant':
    case 'deepseek-r1-distill-llama-70b':
    case 'deepseek-r1-distill-qwen-32b':
    case 'qwen-qwq-32b':
    case 'qwen-2.5-32b':
    case 'mistral-saba-24b':
    case 'meta-llama/llama-4-scout-17b-16e-instruct':
      return new GroqLlama3Service(env, model);
    case 'claude-3-7-sonnet-20250219':
    case 'claude-3-5-sonnet-20241022':
      return new ClaudeService(env, model);
    case 'cf-mistral':
    default:
      return new DefaultCloudflareAIService(env);
  }
}