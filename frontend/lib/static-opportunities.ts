import type { Opportunity } from './types';

const fallbackRoles = [
  { title: 'Full Stack Developer', skills: ['react', 'node.js', 'typescript', 'mongodb'] },
  { title: 'Frontend Engineer', skills: ['react', 'next.js', 'typescript', 'ui-design'] },
  { title: 'Backend Engineer', skills: ['node.js', 'express', 'postgresql', 'system-design'] },
  { title: 'Data Analyst', skills: ['sql', 'python', 'statistics', 'tableau'] },
  { title: 'Machine Learning Engineer', skills: ['python', 'pytorch', 'mlops', 'docker'] },
  { title: 'Cloud Engineer', skills: ['aws', 'kubernetes', 'terraform', 'linux'] },
  { title: 'DevOps Engineer', skills: ['ci_cd', 'docker', 'kubernetes', 'linux'] },
  { title: 'Product Analyst', skills: ['analytics', 'sql', 'communication', 'product_strategy'] }
];

const fallbackCompanies = [
  'Nova AI Labs',
  'Skyline Data',
  'Apex Systems',
  'Orbital Tech',
  'SignalWave',
  'InsightWorks',
  'BrightEdge',
  'DeepCurrent',
  'CloudMosaic',
  'Vector Harbor',
  'PulseStack',
  'GrowthLayer',
  'ByteBridge',
  'Neural Harbor',
  'Cortex Forge',
  'AtlasGrid',
  'SignalSprint',
  'DataHorizon',
  'CloudNest',
  'BluePeak',
  'EdgeBridge',
  'FinTrend',
  'HealthScope',
  'RetailNex',
  'LayerWise',
  'KiteLoop',
  'ZenAxis',
  'CoreBatch',
  'MetaRoute'
];

const fallbackLocations = [
  'Remote - US',
  'Remote - India',
  'Austin, TX',
  'Seattle, WA',
  'New York, NY',
  'Bengaluru, IN',
  'Hyderabad, IN',
  'Toronto, CA'
];

const workModes: Opportunity['workMode'][] = ['remote', 'hybrid', 'onsite'];
const levels: Opportunity['experienceLevel'][] = ['entry', 'mid', 'senior'];

const generatePostedAt = (sequence: number) => {
  const date = new Date();
  date.setDate(date.getDate() - (sequence % 60));
  return date.toISOString();
};

const fallbackCompensation = (type: Opportunity['type'], level: Opportunity['experienceLevel']) => {
  if (type === 'internship') {
    return '$900-$1,500 / month stipend';
  }
  if (level === 'entry') {
    return '$70k-$95k';
  }
  if (level === 'mid') {
    return '$95k-$130k';
  }
  return '$130k-$170k';
};

const buildStaticOpportunities = () => {
  const opportunities: Opportunity[] = [];
  let sequence = 1;

  for (let companyIndex = 0; companyIndex < fallbackCompanies.length; companyIndex += 1) {
    fallbackRoles.forEach((role, roleIndex) => {
      const type: Opportunity['type'] = (companyIndex + roleIndex) % 4 === 0 ? 'internship' : 'job';
      const title = type === 'internship' ? `${role.title} Intern` : role.title;
      const experienceLevel: Opportunity['experienceLevel'] = type === 'internship' ? 'entry' : levels[(companyIndex + roleIndex) % levels.length];

      opportunities.push({
        id: `static-opp-${String(sequence).padStart(4, '0')}`,
        title,
        company: fallbackCompanies[companyIndex],
        location: fallbackLocations[(companyIndex + roleIndex) % fallbackLocations.length],
        type,
        workMode: workModes[(companyIndex + roleIndex) % workModes.length],
        experienceLevel,
        compensation: fallbackCompensation(type, experienceLevel),
        skills: role.skills,
        tracks: ['career-platform', 'recommendation-engine'],
        postedAt: generatePostedAt(sequence),
        description: `Fallback listing for ${title} at ${fallbackCompanies[companyIndex]}.`,
        applyUrl: `https://fallback.jobs.example/${sequence}`,
        source: 'frontend-static-fallback'
      });
      sequence += 1;
    });
  }

  const duplicated = opportunities.flatMap((item, index) => {
    if (index % 3 !== 0) {
      return [item];
    }

    const cloneId = `${item.id}-x`;
    return [
      item,
      {
        ...item,
        id: cloneId,
        location: fallbackLocations[(index + 2) % fallbackLocations.length],
        postedAt: generatePostedAt(index + 120)
      }
    ];
  });

  return duplicated;
};

export const STATIC_OPPORTUNITIES = buildStaticOpportunities();

interface StaticOpportunityQuery {
  q?: string;
  type?: 'job' | 'internship' | 'all';
  roles?: string[];
  limit?: number;
  offset?: number;
}

export const getStaticOpportunities = ({
  q,
  type = 'all',
  roles = [],
  limit = 24,
  offset = 0
}: StaticOpportunityQuery) => {
  const search = q?.trim().toLowerCase() || '';
  const roleFilters = roles.map((role) => role.trim().toLowerCase()).filter(Boolean);

  const filtered = STATIC_OPPORTUNITIES.filter((item) => {
    if (type !== 'all' && item.type !== type) {
      return false;
    }

    if (roleFilters.length && !roleFilters.some((role) => item.title.toLowerCase().includes(role))) {
      return false;
    }

    if (!search) {
      return true;
    }

    const searchable = [item.title, item.company, item.location, ...item.skills, ...item.tracks].join(' ').toLowerCase();
    return searchable.includes(search);
  });

  return {
    items: filtered.slice(offset, offset + limit),
    total: filtered.length,
    hasMore: offset + limit < filtered.length
  };
};
