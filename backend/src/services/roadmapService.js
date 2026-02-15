const paceMultiplierMap = {
  casual: 1.4,
  balanced: 1,
  intensive: 0.8
};

const parseDurationMonths = (duration = '') => {
  const match = duration.match(/(\d+)\s*-\s*(\d+)/);
  if (match) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    return Math.max(1, end - start + 1);
  }
  const singleMatch = duration.match(/(\d+)/);
  if (singleMatch) {
    return Number(singleMatch[1]);
  }
  return 2;
};

export const buildPersonalizedRoadmap = ({
  roadmapTemplate = [],
  recommendedSkills = [],
  learningPace = 'balanced',
  weeklyHours = 8
}) => {
  const paceMultiplier = paceMultiplierMap[learningPace] || 1;
  const skillsPerPhase = Math.max(1, Math.ceil(recommendedSkills.length / Math.max(roadmapTemplate.length, 1)));

  return roadmapTemplate.map((step, index) => {
    const baseMonths = parseDurationMonths(step.duration);
    const adjustedMonths = Math.max(1, Math.round(baseMonths * paceMultiplier));
    const phaseSkills = recommendedSkills.slice(index * skillsPerPhase, (index + 1) * skillsPerPhase);

    return {
      phase: step.phase,
      duration: `${adjustedMonths} month(s)`,
      weeklyHours,
      objectives: [
        ...step.objectives,
        ...(phaseSkills.length ? [`Focus skills: ${phaseSkills.join(', ')}`] : [])
      ]
    };
  });
};
