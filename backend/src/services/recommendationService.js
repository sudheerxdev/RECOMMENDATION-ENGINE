import CareerPath from '../models/CareerPath.js';
import Recommendation from '../models/Recommendation.js';
import { COURSE_CATALOG } from '../data/courseCatalog.js';
import { ApiError } from '../utils/ApiError.js';
import { clamp, cosineSimilarity, overlapRatio } from '../utils/similarity.js';
import { normalizeSkill, normalizeSkills } from '../utils/skillNormalizer.js';
import { normalizeTextToken, uniqueArray } from '../utils/text.js';
import { getEmbedding } from './embeddingService.js';
import { extractSkillsFromResumeText, generateRecommendationExplanation } from './llmService.js';
import { buildPersonalizedRoadmap } from './roadmapService.js';

const levelRank = {
  entry: 1,
  mid: 2,
  senior: 3
};

const buildUserProfileDocument = ({ skills, interests, experienceLevel, preferences, resumeText }) =>
  [
    `Skills: ${skills.join(', ')}`,
    `Interests: ${interests.join(', ')}`,
    `Experience: ${experienceLevel}`,
    `Desired work style: ${preferences?.desiredWorkStyle || 'any'}`,
    `Preferred industries: ${preferences?.targetIndustries?.join(', ') || 'none'}`,
    `Resume summary: ${resumeText || 'none'}`
  ].join('\n');

const buildCareerDocument = (career) =>
  [
    career.title,
    career.description,
    `Required skills: ${career.requiredSkills.join(', ')}`,
    `Optional skills: ${career.optionalSkills.join(', ')}`,
    `Interests: ${career.interests.join(', ')}`,
    `Roles: ${career.relatedJobRoles.join(', ')}`,
    `Tags: ${career.tags.join(', ')}`
  ].join('\n');

const getExperienceScore = (careerExperienceLevels, userLevel) => {
  if (!careerExperienceLevels?.length || !userLevel) {
    return 0.5;
  }

  if (careerExperienceLevels.includes(userLevel)) {
    return 1;
  }

  const careerMin = Math.min(...careerExperienceLevels.map((level) => levelRank[level] || 2));
  const careerMax = Math.max(...careerExperienceLevels.map((level) => levelRank[level] || 2));
  const userRank = levelRank[userLevel] || 1;

  if (userRank < careerMin) {
    return 0.45;
  }

  if (userRank > careerMax) {
    return 0.8;
  }

  return 0.6;
};

const getPreferenceScore = (career, preferences = {}) => {
  const checks = [];
  const tags = (career.tags || []).map(normalizeTextToken);
  const desiredWorkStyle = normalizeTextToken(preferences.desiredWorkStyle || '');

  if (desiredWorkStyle && desiredWorkStyle !== 'any') {
    checks.push(tags.includes(desiredWorkStyle) ? 1 : 0.3);
  }

  const targetIndustries = (preferences.targetIndustries || []).map(normalizeTextToken).filter(Boolean);
  if (targetIndustries.length) {
    const industryHit = targetIndustries.some((industry) => tags.includes(industry));
    checks.push(industryHit ? 1 : 0.4);
  }

  if (!checks.length) {
    return 0.6;
  }

  return checks.reduce((sum, value) => sum + value, 0) / checks.length;
};

const getSuggestedCourses = ({
  recommendedSkills,
  experienceLevel,
  careerLearningResources = [],
  limit = 6
}) => {
  const maxLevelRank = levelRank[experienceLevel] || 1;
  const recommendedSet = new Set(recommendedSkills);
  const normalizedCareerResources = careerLearningResources.map((resource) => ({
    title: resource.title,
    provider: resource.provider,
    type: resource.type,
    skill: normalizeSkill(resource.skill),
    url: resource.url,
    imageUrl: resource.imageUrl || null
  }));

  const fromCatalog = COURSE_CATALOG.filter((course) => {
    const courseLevelRank = levelRank[course.level] || 1;
    return recommendedSet.has(course.skill) && courseLevelRank <= maxLevelRank + 1;
  });

  return uniqueArray(
    [...normalizedCareerResources, ...fromCatalog]
      .filter((resource) => resource.title && resource.url)
      .map((resource) => JSON.stringify(resource))
  )
    .map((resource) => JSON.parse(resource))
    .slice(0, limit);
};

const createProjectIdeas = ({ careerTitle, nativeProjects = [], skillGap = [] }) => {
  const projects = [...nativeProjects];
  if (skillGap.length) {
    projects.push(
      `Build a capstone project for ${careerTitle} that explicitly demonstrates ${skillGap
        .slice(0, 3)
        .join(', ')}.`
    );
  }

  return uniqueArray(projects).slice(0, 4);
};

const formatSuitability = (score) => Math.round(clamp(score, 0, 1) * 100);

const buildMetrics = ({ embeddingScore, skillMatchScore, interestScore, experienceScore, preferenceScore, popularityScore }) => ({
  embeddingScore: formatSuitability(embeddingScore),
  skillMatchScore: formatSuitability(skillMatchScore),
  interestScore: formatSuitability(interestScore),
  experienceScore: formatSuitability(experienceScore),
  preferenceScore: formatSuitability(preferenceScore),
  popularityScore: formatSuitability(popularityScore)
});

const prepareCareerEmbedding = async ({ career, expectedDimension }) => {
  const existingEmbedding = career.embedding || [];
  if (existingEmbedding.length && (!expectedDimension || existingEmbedding.length === expectedDimension)) {
    return existingEmbedding;
  }

  const generated = await getEmbedding(buildCareerDocument(career));
  if (career._id) {
    CareerPath.updateOne({ _id: career._id }, { $set: { embedding: generated } }).catch(() => null);
  }
  return generated;
};

export const generateRecommendations = async ({ input, user }) => {
  const skillsFromInput = normalizeSkills([...(input.skills || []), ...(user?.skills || [])]);
  const interestsFromInput = uniqueArray([...(input.interests || []), ...(user?.interests || [])].map(normalizeTextToken));
  const experienceLevel = input.experienceLevel || user?.experienceLevel || 'entry';
  const userPreferences =
    user?.preferences && typeof user.preferences.toObject === 'function' ? user.preferences.toObject() : user?.preferences || {};
  const preferences = { ...userPreferences, ...(input.preferences || {}) };
  const resumeText = input.resumeText || '';
  const extractedResumeSkills = await extractSkillsFromResumeText(resumeText);
  const normalizedSkills = uniqueArray([...skillsFromInput, ...extractedResumeSkills]);

  const careerPaths = await CareerPath.find({ isActive: true }).lean();
  if (!careerPaths.length) {
    throw new ApiError(404, 'Career dataset is empty. Seed career paths before requesting recommendations.');
  }

  const userEmbedding = await getEmbedding(
    buildUserProfileDocument({
      skills: normalizedSkills,
      interests: interestsFromInput,
      experienceLevel,
      preferences,
      resumeText
    })
  );
  const userSkillSet = new Set(normalizedSkills);
  const userInterestSet = interestsFromInput;

  const scored = await Promise.all(
    careerPaths.map(async (career) => {
      const normalizedRequiredSkills = normalizeSkills(career.requiredSkills || []);
      const normalizedOptionalSkills = normalizeSkills(career.optionalSkills || []);
      const normalizedInterests = uniqueArray((career.interests || []).map(normalizeTextToken));

      const careerEmbedding = await prepareCareerEmbedding({
        career,
        expectedDimension: userEmbedding.length
      });

      const rawCosine = cosineSimilarity(userEmbedding, careerEmbedding);
      const embeddingScore = clamp((rawCosine + 1) / 2, 0, 1);
      const skillMatchScore = overlapRatio(normalizedRequiredSkills, normalizedSkills);
      const interestScore = overlapRatio(normalizedInterests, userInterestSet);
      const experienceScore = getExperienceScore(career.experienceLevels, experienceLevel);
      const preferenceScore = getPreferenceScore(career, preferences);
      const popularityScore = clamp(career.popularityScore ?? 0.5, 0, 1);

      const suitabilityScore =
        embeddingScore * 0.4 +
        skillMatchScore * 0.25 +
        interestScore * 0.12 +
        experienceScore * 0.1 +
        preferenceScore * 0.06 +
        popularityScore * 0.07;

      const matchedSkills = normalizedRequiredSkills.filter((skill) => userSkillSet.has(skill));
      const skillGap = normalizedRequiredSkills.filter((skill) => !userSkillSet.has(skill));
      const recommendedSkills = uniqueArray([
        ...skillGap,
        ...normalizedOptionalSkills.filter((skill) => !userSkillSet.has(skill))
      ]).slice(0, 10);

      const suggestedCourses = getSuggestedCourses({
        recommendedSkills,
        experienceLevel,
        careerLearningResources: career.learningResources
      });

      const projectIdeas = createProjectIdeas({
        careerTitle: career.title,
        nativeProjects: career.projectIdeas || [],
        skillGap
      });

      const learningRoadmap = buildPersonalizedRoadmap({
        roadmapTemplate: career.roadmapTemplate || [],
        recommendedSkills,
        learningPace: preferences.learningPace || 'balanced',
        weeklyHours: preferences.weeklyHours || 8
      });

      return {
        careerPathId: career._id.toString(),
        title: career.title,
        description: career.description,
        suitabilityScore: formatSuitability(suitabilityScore),
        scoreBreakdown: buildMetrics({
          embeddingScore,
          skillMatchScore,
          interestScore,
          experienceScore,
          preferenceScore,
          popularityScore
        }),
        matchedSkills,
        skillGap,
        recommendedSkillsToLearn: recommendedSkills,
        suggestedCourses,
        projectIdeas,
        recommendedJobRoles: career.relatedJobRoles || [],
        learningRoadmap,
        explanation: ''
      };
    })
  );

  const topK = input.topK || 5;
  const ranked = scored.sort((a, b) => b.suitabilityScore - a.suitabilityScore).slice(0, topK);
  const explanationLimit = 4;

  const withExplanations = await Promise.all(
    ranked.map(async (item, index) => {
      if (index >= explanationLimit) {
        return {
          ...item,
          explanation: `${item.title} is a strong fit based on your profile. Focus on the top listed skill gaps and complete one capstone project to increase readiness.`
        };
      }
      const explanation = await generateRecommendationExplanation({
        careerTitle: item.title,
        suitabilityScore: item.suitabilityScore,
        matchedSkills: item.matchedSkills,
        skillGap: item.skillGap,
        experienceLevel
      });
      return {
        ...item,
        explanation
      };
    })
  );

  if (user?._id) {
    const careerPaths = withExplanations.map((item) => item.title);
    const missingSkills = uniqueArray(withExplanations.flatMap((item) => item.skillGap));
    const roadmap = withExplanations.map((item) => ({
      careerPath: item.title,
      steps: item.learningRoadmap
    }));
    const courses = uniqueArray(
      withExplanations
        .flatMap((item) => item.suggestedCourses)
        .map((course) => JSON.stringify(course))
    ).map((course) => JSON.parse(course));
    const projects = uniqueArray(withExplanations.flatMap((item) => item.projectIdeas));
    const jobs = uniqueArray(withExplanations.flatMap((item) => item.recommendedJobRoles));

    Recommendation.create({
      userId: user._id,
      careerPaths,
      missingSkills,
      roadmap,
      courses,
      projects,
      jobs,
      recommendationPayload: {
        inputSnapshot: {
          skills: normalizedSkills,
          interests: interestsFromInput,
          experienceLevel,
          preferences
        },
        recommendations: withExplanations
      }
    }).catch(() => null);
  }

  return {
    generatedAt: new Date().toISOString(),
    profileInsights: {
      normalizedSkills,
      extractedResumeSkills,
      normalizedInterests: interestsFromInput,
      experienceLevel
    },
    recommendations: withExplanations,
    bestCareerPath: withExplanations[0] || null
  };
};
