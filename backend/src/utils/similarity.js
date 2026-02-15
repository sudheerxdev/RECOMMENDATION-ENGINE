export const cosineSimilarity = (vectorA = [], vectorB = []) => {
  if (!vectorA.length || !vectorB.length || vectorA.length !== vectorB.length) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i += 1) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

export const overlapRatio = (source = [], target = []) => {
  if (!source.length || !target.length) {
    return 0;
  }

  const sourceSet = new Set(source);
  const targetSet = new Set(target);
  let overlap = 0;

  sourceSet.forEach((token) => {
    if (targetSet.has(token)) {
      overlap += 1;
    }
  });

  return overlap / sourceSet.size;
};

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
