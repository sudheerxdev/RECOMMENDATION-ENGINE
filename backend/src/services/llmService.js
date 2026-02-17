import { env } from '../config/env.js';
import { getOpenAIClient } from '../config/openai.js';
import { extractKnownSkillsFromText, normalizeSkills } from '../utils/skillNormalizer.js';
import { truncate } from '../utils/text.js';

const FALLBACK_ASSISTANT_REPLY =
  'Focus on one target role, close its highest-impact skill gaps first, and ship portfolio projects that mirror real job responsibilities.';

const toLower = (value = '') => value.toLowerCase().trim();

const pickReplyVariant = (message = '') => {
  if (!message) {
    return 0;
  }
  let hash = 0;
  for (let i = 0; i < message.length; i += 1) {
    hash = (hash * 31 + message.charCodeAt(i)) % 9973;
  }
  return hash % 3;
};

const buildFallbackAssistantReply = ({ message, userProfile, recommendationContext = [], chatHistory = [] }) => {
  const question = toLower(message);
  const topRecommendation = recommendationContext[0] || {};
  const topRole = topRecommendation.title || 'your target role';
  const firstSkill =
    topRecommendation.recommendedSkillsToLearn?.[0] ||
    topRecommendation.skillGap?.[0] ||
    userProfile?.skills?.[0] ||
    'one priority skill';
  const secondSkill =
    topRecommendation.recommendedSkillsToLearn?.[1] ||
    topRecommendation.skillGap?.[1] ||
    userProfile?.skills?.[1] ||
    'one supporting skill';
  const pace = userProfile?.preferences?.learningPace || 'balanced';
  const variant = pickReplyVariant(question);
  const previousAssistantReply =
    chatHistory
      .slice()
      .reverse()
      .find((turn) => turn?.role === 'assistant')?.content || '';

  if (/roadmap|plan|week|month|schedule|timeline/.test(question)) {
    return `Use a 4-week sprint for ${topRole}: week 1 learn ${firstSkill}, week 2 apply ${firstSkill} in a mini build, week 3 add ${secondSkill}, week 4 ship a portfolio case study and write a reflection. Keep pace ${pace} with 5 focused sessions each week.`;
  }

  if (/project|portfolio|build|capstone/.test(question)) {
    return `Build one project aligned to ${topRole}: define a real problem, implement features that demonstrate ${firstSkill} + ${secondSkill}, add measurable results, and publish a README with tradeoffs. Finish by recording a short demo and listing interview talking points.`;
  }

  if (/interview|resume|cv|hiring|job/.test(question)) {
    return `For ${topRole} interviews, prepare three stories: one skill challenge (${firstSkill}), one project impact story, and one collaboration story. Update your resume bullets with outcomes, not tasks, and practice 5 role-specific questions before applying.`;
  }

  if (/switch|transition|change career|career change/.test(question)) {
    return `Transition into ${topRole} by proving readiness in public: complete one targeted project, close ${firstSkill}, and publish weekly progress. Start applying after you can clearly explain your project architecture, decisions, and outcomes in under 3 minutes.`;
  }

  const variantReplies = [
    `For ${topRole}, prioritize ${firstSkill} first. Spend 10-14 days on fundamentals, then build one practical artifact that proves you can apply it. After that, add ${secondSkill} and update your portfolio evidence.`,
    `Next best step: pick ${topRole} as your focus, close ${firstSkill} this sprint, and avoid multitasking across too many tracks. End the week with a small shipped deliverable and a written learning log.`,
    `Treat this as an execution loop: learn ${firstSkill}, apply it in a scoped build, collect feedback, and iterate. When stable, layer ${secondSkill}. This sequence produces faster interview-ready progress for ${topRole}.`
  ];

  if (previousAssistantReply && previousAssistantReply.includes(firstSkill)) {
    return `A different angle: instead of repeating theory, schedule two deep work blocks this week to apply ${firstSkill} directly in a project for ${topRole}. Then run one mock review focused on architecture and tradeoffs.`;
  }

  return variantReplies[variant] || FALLBACK_ASSISTANT_REPLY;
};

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

export const askCareerAssistant = async ({
  message,
  userProfile,
  recommendationContext = [],
  chatHistory = []
}) => {
  const client = getOpenAIClient();
  if (!client) {
    return buildFallbackAssistantReply({
      message,
      userProfile,
      recommendationContext,
      chatHistory
    });
  }

  try {
    const historyMessages = (chatHistory || [])
      .filter((turn) => turn && (turn.role === 'user' || turn.role === 'assistant') && turn.content)
      .slice(-10)
      .map((turn) => ({
        role: turn.role,
        content: truncate(turn.content, 1200)
      }));

    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.75,
      presence_penalty: 0.5,
      frequency_penalty: 0.35,
      messages: [
        {
          role: 'system',
          content:
            'You are an AI career coach. Give practical, specific, non-generic guidance. Keep replies under 200 words. Never repeat prior answers verbatim; if the question is similar, provide a different actionable angle (e.g., strategy, execution checklist, interview prep, project framing). End with 2-4 concrete next actions.'
        },
        {
          role: 'system',
          content: `User profile: ${JSON.stringify(userProfile)}
Top recommendations: ${JSON.stringify(recommendationContext)}`
        },
        ...historyMessages,
        {
          role: 'user',
          content: `Current question: ${message}`
        }
      ]
    });

    const modelReply = completion?.choices?.[0]?.message?.content?.trim();
    if (modelReply) {
      return modelReply;
    }

    return buildFallbackAssistantReply({
      message,
      userProfile,
      recommendationContext,
      chatHistory
    });
  } catch (error) {
    return buildFallbackAssistantReply({
      message,
      userProfile,
      recommendationContext,
      chatHistory
    });
  }
};
