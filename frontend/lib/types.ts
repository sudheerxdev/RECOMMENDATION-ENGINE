export type ExperienceLevel = 'entry' | 'mid' | 'senior';
export type WorkStyle = 'remote' | 'hybrid' | 'onsite' | 'any';
export type LearningPace = 'casual' | 'balanced' | 'intensive';

export interface User {
  id: string;
  name: string;
  email: string;
  resumeURL?: string | null;
  authProvider?: 'local' | 'google';
  googleLinked?: boolean;
  avatarUrl?: string | null;
  skills: string[];
  interests: string[];
  experienceLevel: ExperienceLevel;
  preferences?: {
    desiredWorkStyle?: WorkStyle;
    targetIndustries?: string[];
    learningPace?: LearningPace;
  };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ResumeAnalysis {
  resumeText: string;
  extractedSkills: string[];
  cloudinaryUrl: string | null;
  textLength: number;
}

export interface Resource {
  title: string;
  provider: string;
  type: string;
  url: string;
  skill?: string;
}

export interface RoadmapStep {
  phase: string;
  duration: string;
  weeklyHours: number;
  objectives: string[];
}

export interface RecommendationItem {
  careerPathId: string;
  title: string;
  description: string;
  suitabilityScore: number;
  scoreBreakdown: {
    embeddingScore: number;
    skillMatchScore: number;
    interestScore: number;
    experienceScore: number;
    preferenceScore: number;
    popularityScore: number;
  };
  matchedSkills: string[];
  skillGap: string[];
  recommendedSkillsToLearn: string[];
  suggestedCourses: Resource[];
  projectIdeas: string[];
  recommendedJobRoles: string[];
  learningRoadmap: RoadmapStep[];
  explanation: string;
}

export interface RecommendationResponse {
  generatedAt: string;
  profileInsights: {
    normalizedSkills: string[];
    extractedResumeSkills: string[];
    normalizedInterests: string[];
    experienceLevel: ExperienceLevel;
  };
  recommendations: RecommendationItem[];
  bestCareerPath: RecommendationItem | null;
}

export interface RecommendationHistoryItem {
  _id: string;
  userId: string;
  careerPaths: string[];
  missingSkills: string[];
  roadmap: Array<{
    careerPath: string;
    steps: RoadmapStep[];
  }>;
  courses: Resource[];
  projects: string[];
  jobs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationRequest {
  skills: string[];
  interests: string[];
  experienceLevel: ExperienceLevel;
  resumeText?: string;
  topK?: number;
  preferences?: {
    desiredWorkStyle?: WorkStyle;
    targetIndustries?: string[];
    learningPace?: LearningPace;
    weeklyHours?: number;
  };
}

export interface CareerPathCatalogItem {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  optionalSkills: string[];
  relatedJobRoles: string[];
  tags: string[];
}
