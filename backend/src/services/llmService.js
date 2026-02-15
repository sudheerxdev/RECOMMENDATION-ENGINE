import { env } from '../config/env.js';
import { getOpenAIClient } from '../config/openai.js';
import { extractKnownSkillsFromText, normalizeSkills } from '../utils/skillNormalizer.js';
import { truncate } from '../utils/text.js';

const FALLBACK_ASSISTANT_REPLY =
  'Focus on one target role, close its highest-impact skill gaps first, and ship portfolio projects that mirror real job responsibilities.';

export const extractSkillsFromResumeText = async (resumeText = '') => {
  const fallbackSkills = extractKnownSkillsFromText(resumeText);
  const client = getOpenAIClient();
  if (!client || !resumeText.trim()) {
    return fallbackSkills;
  }

  try {
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Extract technical and career-relevant skills from resume text. Return strict JSON: {"skills": string[]}. Use concise lowercase skill names.'
        },
        {
          role: 'user',
          content: truncate(resumeText, 12000)
        }
      ]
    });

    const content = completion?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || '{"skills":[]}');
    const skills = Array.isArray(parsed.skills) ? parsed.skills : [];
    const normalized = normalizeSkills(skills);
    return normalized.length ? normalized : fallbackSkills;
  } catch (error) {
    return fallbackSkills;
  }
};

export const generateRecommendationExplanation = async ({
  careerTitle,
  suitabilityScore,
  matchedSkills,
  skillGap,
  experienceLevel
}) => {
  const client = getOpenAIClient();
  if (!client) {
    if (!skillGap.length) {
      return `You are already well aligned for ${careerTitle}. Prioritize advanced projects and interview preparation to convert this fit into job-ready outcomes.`;
    }
    return `${careerTitle} fits your profile with a ${suitabilityScore}% suitability score. Strengthen ${skillGap
      .slice(0, 3)
      .join(', ')} next, then showcase progress through a portfolio project at ${experienceLevel} level complexity.`;
  }

  try {
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'You are a career recommendation explainer. Write one concise paragraph (max 90 words) explaining recommendation fit and next steps.'
        },
        {
          role: 'user',
          content: `Role: ${careerTitle}
Suitability: ${suitabilityScore}%
Matched skills: ${matchedSkills.join(', ') || 'none'}
Skill gaps: ${skillGap.join(', ') || 'none'}
Experience level: ${experienceLevel}`
        }
      ]
    });

    return completion?.choices?.[0]?.message?.content?.trim() || FALLBACK_ASSISTANT_REPLY;
  } catch (error) {
    return FALLBACK_ASSISTANT_REPLY;
  }
};

export const askCareerAssistant = async ({ message, userProfile, recommendationContext = [] }) => {
  const client = getOpenAIClient();
  if (!client) {
    const topRole = recommendationContext?.[0]?.title;
    if (topRole) {
      return `Based on your current profile, prioritize ${topRole} and spend 2-3 weeks closing one key skill gap before moving to advanced topics.`;
    }
    return FALLBACK_ASSISTANT_REPLY;
  }

  try {
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content:
            'You are an AI career coach. Provide concrete, pragmatic guidance. Keep responses under 180 words and include immediate next actions.'
        },
        {
          role: 'user',
          content: `User profile: ${JSON.stringify(userProfile)}
Top recommendations: ${JSON.stringify(recommendationContext)}
Question: ${message}`
        }
      ]
    });
    return completion?.choices?.[0]?.message?.content?.trim() || FALLBACK_ASSISTANT_REPLY;
  } catch (error) {
    return FALLBACK_ASSISTANT_REPLY;
  }
};
