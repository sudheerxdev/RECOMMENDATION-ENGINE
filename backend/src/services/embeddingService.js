import { env } from '../config/env.js';
import { getOpenAIClient } from '../config/openai.js';
import { normalizeTextToken, truncate } from '../utils/text.js';

const FALLBACK_DIMENSION = 256;

const hashToken = (token, seed = 0) => {
  let hash = 2166136261 + seed;
  for (let i = 0; i < token.length; i += 1) {
    hash ^= token.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

const normalizeVector = (vector) => {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!magnitude) {
    return vector;
  }
  return vector.map((value) => value / magnitude);
};

const buildDeterministicEmbedding = (text) => {
  const vector = Array(FALLBACK_DIMENSION).fill(0);
  const tokens = normalizeTextToken(text).split(' ').filter(Boolean);

  tokens.forEach((token, tokenIndex) => {
    const indexA = hashToken(token, tokenIndex) % FALLBACK_DIMENSION;
    const indexB = hashToken(token, tokenIndex + 13) % FALLBACK_DIMENSION;
    const signedValue = ((hashToken(token, tokenIndex + 29) % 2000) / 1000 - 1) * 0.7;
    vector[indexA] += signedValue;
    vector[indexB] -= signedValue * 0.5;
  });

  return normalizeVector(vector);
};

export const getEmbedding = async (text) => {
  const safeText = truncate(text || '', 6000);
  if (!safeText) {
    return buildDeterministicEmbedding('empty profile');
  }

  const client = getOpenAIClient();
  if (!client) {
    return buildDeterministicEmbedding(safeText);
  }

  try {
    const response = await client.embeddings.create({
      model: env.OPENAI_EMBEDDING_MODEL,
      input: safeText
    });
    const embedding = response?.data?.[0]?.embedding;
    if (!embedding?.length) {
      return buildDeterministicEmbedding(safeText);
    }
    return embedding;
  } catch (error) {
    return buildDeterministicEmbedding(safeText);
  }
};
