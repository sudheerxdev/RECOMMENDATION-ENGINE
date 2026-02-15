export const DEFAULT_CAREER_PATHS = [
  {
    title: 'Machine Learning Engineer',
    description:
      'Designs, trains, deploys, and monitors machine learning systems in production environments.',
    requiredSkills: ['python', 'statistics', 'scikit_learn', 'pandas', 'numpy', 'mlops'],
    optionalSkills: ['tensorflow', 'pytorch', 'docker', 'kubernetes', 'aws', 'sql'],
    interests: ['ai', 'automation', 'analytics', 'problem solving'],
    experienceLevels: ['entry', 'mid', 'senior'],
    relatedJobRoles: ['Machine Learning Engineer', 'Applied AI Engineer', 'MLOps Engineer'],
    tags: ['remote', 'high-growth', 'analytical'],
    popularityScore: 0.92,
    learningResources: [
      {
        title: 'Machine Learning Specialization',
        provider: 'Coursera',
        type: 'course',
        skill: 'python',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction'
      },
      {
        title: 'Practical MLOps',
        provider: 'Google Cloud',
        type: 'course',
        skill: 'mlops',
        url: 'https://www.cloudskillsboost.google/'
      }
    ],
    projectIdeas: [
      'Build a job salary prediction API with model monitoring and drift alerts.',
      'Create a recommendation model for learning resources and deploy on a cloud platform.',
      'Develop an NLP classifier for resume-to-job matching with explainability.'
    ],
    roadmapTemplate: [
      {
        phase: 'Foundation',
        duration: '0-2 months',
        objectives: [
          'Master Python, SQL, and statistics fundamentals.',
          'Ship two end-to-end notebooks with clean data pipelines.'
        ]
      },
      {
        phase: 'Modeling and Evaluation',
        duration: '2-4 months',
        objectives: [
          'Train supervised and unsupervised models.',
          'Practice feature engineering and model interpretation.'
        ]
      },
      {
        phase: 'Production and MLOps',
        duration: '4-6 months',
        objectives: [
          'Containerize models and deploy inference APIs.',
          'Implement monitoring, retraining triggers, and CI/CD for ML.'
        ]
      }
    ]
  },
  {
    title: 'Data Scientist',
    description:
      'Uses analytics, statistics, and machine learning to solve business problems and inform strategic decisions.',
    requiredSkills: ['python', 'sql', 'statistics', 'data_analysis', 'data_visualization', 'pandas'],
    optionalSkills: ['numpy', 'scikit_learn', 'communication', 'aws', 'nlp'],
    interests: ['analytics', 'research', 'business impact'],
    experienceLevels: ['entry', 'mid', 'senior'],
    relatedJobRoles: ['Data Scientist', 'Decision Scientist', 'Analytics Scientist'],
    tags: ['hybrid', 'high-growth', 'analytical'],
    popularityScore: 0.88,
    learningResources: [
      {
        title: 'SQL for Data Science',
        provider: 'Coursera',
        type: 'course',
        skill: 'sql',
        url: 'https://www.coursera.org/learn/sql-for-data-science'
      },
      {
        title: 'Machine Learning Specialization',
        provider: 'Coursera',
        type: 'course',
        skill: 'python',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction'
      }
    ],
    projectIdeas: [
      'Analyze churn drivers for a subscription product using cohort analysis and predictive modeling.',
      'Create an executive dashboard with anomaly detection and business recommendations.',
      'Design an A/B testing analysis toolkit for product experiments.'
    ],
    roadmapTemplate: [
      {
        phase: 'Analytics Core',
        duration: '0-2 months',
        objectives: ['Strengthen SQL querying and exploratory analysis.', 'Learn statistical testing rigor.']
      },
      {
        phase: 'Modeling and Storytelling',
        duration: '2-5 months',
        objectives: [
          'Build predictive models and evaluate tradeoffs.',
          'Present findings as business narratives with visual dashboards.'
        ]
      },
      {
        phase: 'Business Ownership',
        duration: '5-7 months',
        objectives: [
          'Lead analytics initiatives tied to KPIs.',
          'Define measurement frameworks for core product metrics.'
        ]
      }
    ]
  },
  {
    title: 'Full Stack Developer',
    description:
      'Builds complete web applications from frontend user experiences to backend APIs and data layers.',
    requiredSkills: ['javascript', 'typescript', 'react', 'next.js', 'node.js', 'express', 'mongodb'],
    optionalSkills: ['sql', 'docker', 'aws', 'git', 'ci_cd'],
    interests: ['web development', 'product building', 'problem solving'],
    experienceLevels: ['entry', 'mid', 'senior'],
    relatedJobRoles: ['Full Stack Engineer', 'Software Engineer', 'Web Application Developer'],
    tags: ['remote', 'product', 'high-demand'],
    popularityScore: 0.9,
    learningResources: [
      {
        title: 'Full-Stack Open',
        provider: 'University of Helsinki',
        type: 'course',
        skill: 'react',
        url: 'https://fullstackopen.com/en/'
      },
      {
        title: 'Node.js API Masterclass',
        provider: 'Udemy',
        type: 'course',
        skill: 'node.js',
        url: 'https://www.udemy.com/course/nodejs-api-masterclass/'
      }
    ],
    projectIdeas: [
      'Build a multi-tenant SaaS dashboard with authentication, billing stubs, and analytics.',
      'Create a real-time collaboration app using WebSockets and robust permission layers.',
      'Develop a recommendation portal with resume parsing and explainable AI insights.'
    ],
    roadmapTemplate: [
      {
        phase: 'Frontend and Backend Core',
        duration: '0-3 months',
        objectives: ['Master React/Next.js fundamentals.', 'Implement secure REST APIs with Node.js and Express.']
      },
      {
        phase: 'System Depth',
        duration: '3-5 months',
        objectives: ['Design scalable database schemas.', 'Add caching, API rate limiting, and observability.']
      },
      {
        phase: 'Production Engineering',
        duration: '5-7 months',
        objectives: ['Containerize applications and automate deployments.', 'Optimize performance and reliability.']
      }
    ]
  },
  {
    title: 'Product Manager',
    description:
      'Leads product strategy, roadmap, and execution by aligning user needs with business goals and engineering delivery.',
    requiredSkills: ['product_strategy', 'roadmap_planning', 'stakeholder_management', 'communication', 'user_research'],
    optionalSkills: ['data_analysis', 'sql', 'ux_design', 'system_design', 'problem_solving'],
    interests: ['product strategy', 'customer empathy', 'cross-functional leadership'],
    experienceLevels: ['entry', 'mid', 'senior'],
    relatedJobRoles: ['Product Manager', 'Growth Product Manager', 'Platform Product Manager'],
    tags: ['hybrid', 'leadership', 'business'],
    popularityScore: 0.83,
    learningResources: [
      {
        title: 'Product Management Fundamentals',
        provider: 'LinkedIn Learning',
        type: 'course',
        skill: 'product_strategy',
        url: 'https://www.linkedin.com/learning/'
      }
    ],
    projectIdeas: [
      'Create a product requirement document for an AI-powered mentorship platform.',
      'Run a discovery sprint with user interviews and define an outcome-driven roadmap.',
      'Develop a KPI hierarchy and experiment plan for onboarding conversion.'
    ],
    roadmapTemplate: [
      {
        phase: 'Discovery and Problem Framing',
        duration: '0-2 months',
        objectives: ['Practice user interviews and JTBD analysis.', 'Translate insights into problem statements.']
      },
      {
        phase: 'Execution and Metrics',
        duration: '2-5 months',
        objectives: ['Write crisp product specs.', 'Define success metrics and run experiments.']
      },
      {
        phase: 'Strategic Leadership',
        duration: '5-8 months',
        objectives: ['Balance roadmap bets and dependencies.', 'Lead stakeholder alignment across functions.']
      }
    ]
  },
  {
    title: 'DevOps Engineer',
    description:
      'Builds reliable delivery pipelines, infrastructure automation, and production observability for software systems.',
    requiredSkills: ['linux', 'docker', 'kubernetes', 'ci_cd', 'aws', 'terraform'],
    optionalSkills: ['ansible', 'gcp', 'azure', 'system_design', 'security'],
    interests: ['infrastructure', 'automation', 'system reliability'],
    experienceLevels: ['entry', 'mid', 'senior'],
    relatedJobRoles: ['DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer'],
    tags: ['remote', 'high-demand', 'operations'],
    popularityScore: 0.86,
    learningResources: [
      {
        title: 'Docker for Developers',
        provider: 'Docker',
        type: 'course',
        skill: 'docker',
        url: 'https://www.docker.com/101-tutorial/'
      },
      {
        title: 'Terraform Associate Prep',
        provider: 'HashiCorp',
        type: 'course',
        skill: 'terraform',
        url: 'https://developer.hashicorp.com/terraform/tutorials'
      }
    ],
    projectIdeas: [
      'Set up GitOps-based Kubernetes deployment for a microservice stack.',
      'Build a CI/CD pipeline with automated security scans and rollback support.',
      'Create infrastructure-as-code modules for multi-environment deployments.'
    ],
    roadmapTemplate: [
      {
        phase: 'Ops Fundamentals',
        duration: '0-2 months',
        objectives: ['Gain Linux command-line confidence.', 'Learn container basics and networking concepts.']
      },
      {
        phase: 'Automation and Cloud',
        duration: '2-5 months',
        objectives: ['Implement CI/CD pipelines.', 'Provision cloud infrastructure with Terraform.']
      },
      {
        phase: 'Reliability Engineering',
        duration: '5-8 months',
        objectives: ['Introduce observability and SLOs.', 'Harden production readiness and incident response.']
      }
    ]
  },
  {
    title: 'Cybersecurity Analyst',
    description:
      'Protects systems and data by monitoring threats, hardening controls, and responding to security incidents.',
    requiredSkills: ['security', 'networking', 'incident_response', 'siem', 'problem_solving'],
    optionalSkills: ['penetration_testing', 'linux', 'communication', 'cloud'],
    interests: ['risk management', 'threat intelligence', 'digital defense'],
    experienceLevels: ['entry', 'mid', 'senior'],
    relatedJobRoles: ['Cybersecurity Analyst', 'Security Operations Analyst', 'Threat Analyst'],
    tags: ['onsite', 'compliance', 'high-demand'],
    popularityScore: 0.8,
    learningResources: [
      {
        title: 'OWASP Top 10',
        provider: 'OWASP',
        type: 'documentation',
        skill: 'security',
        url: 'https://owasp.org/www-project-top-ten/'
      },
      {
        title: 'CompTIA Security+',
        provider: 'CompTIA',
        type: 'certification',
        skill: 'incident_response',
        url: 'https://www.comptia.org/certifications/security'
      }
    ],
    projectIdeas: [
      'Build a security incident playbook and simulate response exercises.',
      'Create a threat detection dashboard from sample SIEM logs.',
      'Design a vulnerability assessment process for a cloud-native stack.'
    ],
    roadmapTemplate: [
      {
        phase: 'Security Foundations',
        duration: '0-3 months',
        objectives: ['Learn core security principles and attack vectors.', 'Understand network and endpoint basics.']
      },
      {
        phase: 'Detection and Response',
        duration: '3-6 months',
        objectives: ['Practice SIEM query writing.', 'Run incident triage and postmortem workflows.']
      },
      {
        phase: 'Advanced Security Operations',
        duration: '6-9 months',
        objectives: ['Implement threat hunting routines.', 'Align controls with compliance requirements.']
      }
    ]
  },
  {
    title: 'UX/UI Designer',
    description:
      'Designs intuitive user experiences and polished interfaces through research, prototyping, and usability testing.',
    requiredSkills: ['ux_design', 'ui_design', 'figma', 'wireframing', 'user_research', 'communication'],
    optionalSkills: ['product_strategy', 'data_analysis', 'frontend', 'accessibility'],
    interests: ['design', 'human-centered problem solving', 'product thinking'],
    experienceLevels: ['entry', 'mid', 'senior'],
    relatedJobRoles: ['UX Designer', 'Product Designer', 'UI Designer'],
    tags: ['hybrid', 'creative', 'product'],
    popularityScore: 0.78,
    learningResources: [
      {
        title: 'Google UX Design Certificate',
        provider: 'Coursera',
        type: 'course',
        skill: 'ux_design',
        url: 'https://www.coursera.org/professional-certificates/google-ux-design'
      }
    ],
    projectIdeas: [
      'Redesign an existing app flow and validate improvements through usability testing.',
      'Build a responsive design system in Figma with accessibility-ready components.',
      'Prototype an AI-powered career dashboard and measure interaction quality.'
    ],
    roadmapTemplate: [
      {
        phase: 'Design Fundamentals',
        duration: '0-2 months',
        objectives: ['Practice wireframing and visual hierarchy.', 'Learn UX heuristics and accessibility basics.']
      },
      {
        phase: 'Research and Prototyping',
        duration: '2-5 months',
        objectives: ['Run user interviews and synthesize insights.', 'Create interactive prototypes and test flows.']
      },
      {
        phase: 'Portfolio and Product Impact',
        duration: '5-7 months',
        objectives: ['Build end-to-end case studies.', 'Show measurable impact from design decisions.']
      }
    ]
  },
  {
    title: 'Cloud Solutions Architect',
    description:
      'Designs secure, scalable cloud architectures and guides engineering teams on cloud adoption strategy.',
    requiredSkills: ['aws', 'azure', 'gcp', 'system_design', 'security', 'communication'],
    optionalSkills: ['kubernetes', 'terraform', 'ci_cd', 'linux', 'cost_optimization'],
    interests: ['cloud systems', 'architecture', 'technical leadership'],
    experienceLevels: ['mid', 'senior'],
    relatedJobRoles: ['Cloud Architect', 'Solutions Architect', 'Principal Cloud Engineer'],
    tags: ['hybrid', 'architecture', 'enterprise'],
    popularityScore: 0.84,
    learningResources: [
      {
        title: 'AWS Cloud Practitioner Essentials',
        provider: 'AWS',
        type: 'course',
        skill: 'aws',
        url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials'
      },
      {
        title: 'System Design Primer',
        provider: 'GitHub',
        type: 'documentation',
        skill: 'system_design',
        url: 'https://github.com/donnemartin/system-design-primer'
      }
    ],
    projectIdeas: [
      'Architect a multi-region application with disaster recovery and cost controls.',
      'Design secure identity and access management for a multi-team cloud platform.',
      'Create a migration blueprint from monolith to cloud-native services.'
    ],
    roadmapTemplate: [
      {
        phase: 'Cloud Foundation',
        duration: '0-3 months',
        objectives: ['Understand core services across major cloud providers.', 'Practice secure cloud networking.']
      },
      {
        phase: 'Architecture Mastery',
        duration: '3-6 months',
        objectives: ['Design for scalability, resilience, and cost efficiency.', 'Lead architecture reviews.']
      },
      {
        phase: 'Strategic Influence',
        duration: '6-9 months',
        objectives: ['Define cloud governance standards.', 'Mentor teams on architecture best practices.']
      }
    ]
  }
];
