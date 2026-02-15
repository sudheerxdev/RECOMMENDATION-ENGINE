import OpenAI from 'openai';
import { env } from './env.js';

let openAIClient = null;

if (env.OPENAI_API_KEY) {
  openAIClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export const getOpenAIClient = () => openAIClient;
