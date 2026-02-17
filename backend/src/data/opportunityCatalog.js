const roleTemplates = [
  {
    title: 'Full Stack Developer',
    skills: ['react', 'node.js', 'typescript', 'mongodb'],
    tracks: ['web-platform', 'saas'],
    salaryBand: ['$70k-$95k', '$95k-$130k', '$130k-$170k']
  },
  {
    title: 'Frontend Engineer',
    skills: ['react', 'next.js', 'typescript', 'ui-design'],
    tracks: ['frontend', 'design-systems'],
    salaryBand: ['$68k-$92k', '$90k-$122k', '$120k-$160k']
  },
  {
    title: 'Backend Engineer',
    skills: ['node.js', 'express', 'postgresql', 'system-design'],
    tracks: ['api-platform', 'distributed-systems'],
    salaryBand: ['$75k-$102k', '$100k-$138k', '$135k-$178k']
  },
  {
    title: 'Data Analyst',
    skills: ['sql', 'python', 'tableau', 'statistics'],
    tracks: ['analytics', 'business-intelligence'],
    salaryBand: ['$62k-$85k', '$84k-$112k', '$110k-$145k']
  },
  {
    title: 'Machine Learning Engineer',
    skills: ['python', 'pytorch', 'mlops', 'docker'],
    tracks: ['ai-platform', 'model-ops'],
    salaryBand: ['$85k-$120k', '$118k-$158k', '$156k-$205k']
  },
  {
    title: 'Data Scientist',
    skills: ['python', 'scikit_learn', 'statistics', 'sql'],
    tracks: ['experimentation', 'predictive-modeling'],
    salaryBand: ['$82k-$116k', '$114k-$152k', '$150k-$198k']
  },
  {
    title: 'AI Product Analyst',
    skills: ['product_strategy', 'analytics', 'prompt_engineering', 'sql'],
    tracks: ['product-analytics', 'ai-product'],
    salaryBand: ['$68k-$90k', '$88k-$118k', '$116k-$148k']
  },
  {
    title: 'Cloud Engineer',
    skills: ['aws', 'terraform', 'kubernetes', 'linux'],
    tracks: ['cloud', 'infrastructure'],
    salaryBand: ['$78k-$108k', '$105k-$142k', '$140k-$184k']
  },
  {
    title: 'DevOps Engineer',
    skills: ['ci_cd', 'docker', 'kubernetes', 'linux'],
    tracks: ['devops', 'platform'],
    salaryBand: ['$80k-$110k', '$108k-$146k', '$144k-$188k']
  },
  {
    title: 'Cybersecurity Analyst',
    skills: ['security', 'incident_response', 'siem', 'linux'],
    tracks: ['security-ops', 'threat-detection'],
    salaryBand: ['$72k-$98k', '$95k-$128k', '$126k-$165k']
  },
  {
    title: 'Product Manager',
    skills: ['product_strategy', 'roadmap_planning', 'analytics', 'communication'],
    tracks: ['product-management', 'growth'],
    salaryBand: ['$85k-$120k', '$118k-$155k', '$152k-$198k']
  },
  {
    title: 'Business Analyst',
    skills: ['sql', 'excel', 'communication', 'roadmap_planning'],
    tracks: ['strategy', 'operations'],
    salaryBand: ['$60k-$82k', '$80k-$105k', '$102k-$132k']
  },
  {
    title: 'QA Automation Engineer',
    skills: ['javascript', 'typescript', 'automation', 'ci_cd'],
    tracks: ['quality-engineering', 'test-automation'],
    salaryBand: ['$66k-$90k', '$88k-$116k', '$114k-$148k']
  },
  {
    title: 'Mobile App Developer',
    skills: ['react-native', 'typescript', 'api-integration', 'ui-design'],
    tracks: ['mobile', 'consumer-apps'],
    salaryBand: ['$72k-$98k', '$96k-$126k', '$124k-$162k']
  },
  {
    title: 'Prompt Engineer',
    skills: ['prompt_engineering', 'llm-evaluation', 'python', 'communication'],
    tracks: ['gen-ai', 'evaluation'],
    salaryBand: ['$78k-$108k', '$106k-$142k', '$140k-$182k']
  },
  {
    title: 'Research Assistant (AI)',
    skills: ['python', 'nlp', 'statistics', 'writing'],
    tracks: ['research', 'applied-ai'],
    salaryBand: ['$48k-$65k', '$64k-$84k', '$82k-$102k']
  }
];

const companies = [
  'Nova AI Labs',
  'Apex Systems',
  'Orbit Logic',
  'Skyline Data',
  'ByteBridge',
  'Quantum Thread',
  'GrowthLayer',
  'DeepSignal',
  'PixelHarbor',
  'Sierra Cloud',
  'Northstar Insights',
  'BluePeak Tech',
  'RapidScale',
  'Helix Forge',
  'BrightEdge Analytics',
  'Argo Vertex',
  'Neural Harbor',
  'Evergreen Digital',
  'TerraVision',
  'Moonshot Commerce',
  'AtlasGrid',
  'CodeCurrent',
  'Cortex Foundry',
  'PulseStack',
  'PrimeLattice',
  'InsightDrive',
  'VertexPath',
  'GradientWorks',
  'CloudMosaic',
  'SignalSprint',
  'MetaRoute',
  'CraftScale',
  'FinTrend',
  'HealthScope',
  'RetailNex',
  'InfraBloom',
  'EdgeBridge',
  'DataHorizon',
  'LayerWise',
  'AltoSphere',
  'KiteLoop',
  'VectorHive',
  'CoreBatch',
  'Nimble Orbit',
  'Zen Axis'
];

const locations = [
  'Remote - US',
  'Remote - India',
  'San Francisco, CA',
  'Seattle, WA',
  'Austin, TX',
  'New York, NY',
  'Boston, MA',
  'Chicago, IL',
  'Atlanta, GA',
  'Denver, CO',
  'Bengaluru, IN',
  'Hyderabad, IN',
  'Pune, IN',
  'Gurugram, IN',
  'Toronto, CA',
  'Vancouver, CA',
  'Dublin, IE',
  'Berlin, DE',
  'Singapore',
  'Sydney, AU'
];

const workModes = ['remote', 'hybrid', 'onsite'];
const experienceCycle = ['entry', 'mid', 'senior'];

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const generatePostedAt = (sequence) => {
  const daysAgo = sequence % 75;
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);
  return now.toISOString();
};

const getCompensation = ({ type, experienceLevel, salaryBand }) => {
  if (type === 'internship') {
    if (experienceLevel === 'entry') {
      return '$900-$1,300 / month stipend';
    }
    if (experienceLevel === 'mid') {
      return '$1,200-$1,700 / month stipend';
    }
    return '$1,600-$2,100 / month stipend';
  }

  if (experienceLevel === 'entry') {
    return salaryBand[0];
  }
  if (experienceLevel === 'mid') {
    return salaryBand[1];
  }
  return salaryBand[2];
};

const buildOpportunity = ({ sequence, role, company, location, workMode, type, experienceLevel }) => {
  const title = type === 'internship' ? `${role.title} Intern` : role.title;
  const id = `opp-${String(sequence).padStart(4, '0')}`;

  return {
    id,
    title,
    company,
    location,
    type,
    workMode,
    experienceLevel,
    compensation: getCompensation({ type, experienceLevel, salaryBand: role.salaryBand }),
    skills: role.skills,
    tracks: role.tracks,
    postedAt: generatePostedAt(sequence),
    description: `Join ${company} as a ${title} and work on ${role.tracks.join(', ')} initiatives with a ${workMode} setup.`,
    applyUrl: `https://careers.example.com/${toSlug(company)}/${toSlug(title)}/${id}`,
    source: 'dummy-catalog'
  };
};

const buildCatalog = () => {
  const opportunities = [];
  let sequence = 1;

  companies.forEach((company, companyIndex) => {
    roleTemplates.forEach((role, roleIndex) => {
      const location = locations[(companyIndex + roleIndex) % locations.length];
      const workMode = workModes[(companyIndex + roleIndex) % workModes.length];
      const experienceLevel = experienceCycle[(companyIndex + roleIndex) % experienceCycle.length];

      opportunities.push(
        buildOpportunity({
          sequence,
          role,
          company,
          location,
          workMode,
          type: 'job',
          experienceLevel
        })
      );
      sequence += 1;

      if ((companyIndex + roleIndex) % 3 === 0) {
        opportunities.push(
          buildOpportunity({
            sequence,
            role,
            company,
            location,
            workMode: workModes[(companyIndex + roleIndex + 1) % workModes.length],
            type: 'internship',
            experienceLevel: 'entry'
          })
        );
        sequence += 1;
      }
    });
  });

  return opportunities;
};

export const OPPORTUNITY_CATALOG = buildCatalog();
