import { CORE_SKILLS, SKILL_SYNONYMS } from '../data/skillSynonyms.js';
import { normalizeTextToken, uniqueArray } from './text.js';

const synonymLookup = new Map();

Object.entries(SKILL_SYNONYMS).forEach(([canonical, synonyms]) => {
  synonymLookup.set(normalizeTextToken(canonical), canonical);
  synonyms.forEach((synonym) => {
    synonymLookup.set(normalizeTextToken(synonym), canonical);
  });
});

export const normalizeSkill = (skill) => {
  const token = normalizeTextToken(skill);
  if (!token) {
    return '';
  }
  return synonymLookup.get(token) || token;
};

export const normalizeSkills = (skills = []) => uniqueArray(skills.map(normalizeSkill).filter(Boolean));

export const extractKnownSkillsFromText = (text = '') => {
  const normalizedText = normalizeTextToken(text);
  if (!normalizedText) {
    return [];
  }

  const detectedSkills = [];
  synonymLookup.forEach((canonical, token) => {
    const regex = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(normalizedText)) {
      detectedSkills.push(canonical);
    }
  });

  return uniqueArray(detectedSkills);
};

export const getKnownSkills = () => CORE_SKILLS;
