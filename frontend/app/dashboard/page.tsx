'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, BrainCircuit, FileText, Loader2, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsCards } from '@/components/dashboard/analytics-cards';
import { AchievementBadges } from '@/components/dashboard/achievement-badges';
import { HistoryTimeline } from '@/components/dashboard/history-timeline';
import { JobFeed } from '@/components/dashboard/job-feed';
import { LearningHub } from '@/components/dashboard/learning-hub';
import { OnboardingJourney } from '@/components/dashboard/onboarding-journey';
import { RecommendationCompare } from '@/components/dashboard/recommendation-compare';
import { RecommendationFeed } from '@/components/dashboard/recommendation-feed';
import { DashboardRightRail } from '@/components/dashboard/right-rail';
import { SavedGoals } from '@/components/dashboard/saved-goals';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { SkillTracker } from '@/components/dashboard/skill-tracker';
import { DashboardTopBar } from '@/components/dashboard/top-bar';
import { ProfilePanel } from '@/components/dashboard/profile-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import { clearGoogleSessionHint } from '@/lib/google-auth';
import { OPEN_PROFILE_PANEL_EVENT } from '@/lib/profile-panel';
import type {
  CareerGoal,
  RecommendationHistoryItem,
  RecommendationResponse,
  ResumeAnalysis,
  User
} from '@/lib/types';
import { parseTags } from '@/lib/utils';

const GOALS_STORAGE_KEY_PREFIX = 'acep_saved_goals';

const hydrateRecommendationFromHistory = (
  historyItem: RecommendationHistoryItem | undefined
): RecommendationResponse | null => {
  const recommendations = historyItem?.recommendationPayload?.recommendations || [];
  if (!recommendations.length || !historyItem) {
    return null;
  }

  const experienceLevel = historyItem.recommendationPayload?.inputSnapshot?.experienceLevel || 'entry';

  return {
    generatedAt: historyItem.createdAt,
    profileInsights: {
      normalizedSkills: [],
      extractedResumeSkills: [],
      normalizedInterests: [],
      experienceLevel
    },
    recommendations,
    bestCareerPath: recommendations[0] || null
  };
};

const goalStorageKey = (userId: string) => `${GOALS_STORAGE_KEY_PREFIX}_${userId}`;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [history, setHistory] = useState<RecommendationHistoryItem[]>([]);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedGoals, setSavedGoals] = useState<CareerGoal[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');

  const [skillsInput, setSkillsInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'mid' | 'senior'>('entry');
  const [desiredWorkStyle, setDesiredWorkStyle] = useState<'remote' | 'hybrid' | 'onsite' | 'any'>('any');
  const [learningPace, setLearningPace] = useState<'casual' | 'balanced' | 'intensive'>('balanced');
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [targetIndustriesInput, setTargetIndustriesInput] = useState('');
  const [topK, setTopK] = useState(5);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    Promise.all([apiClient.me(), apiClient.getRecommendationHistory().catch(() => [])])
      .then(([profile, fetchedHistory]) => {
        setUser(profile);
        setProfileName(profile.name || '');
        setAvatarUrlInput(profile.avatarUrl || '');
        setSkillsInput(profile.skills.join(', '));
        setInterestsInput(profile.interests.join(', '));
        setExperienceLevel(profile.experienceLevel);
        setDesiredWorkStyle(profile.preferences?.desiredWorkStyle || 'any');
        setLearningPace(profile.preferences?.learningPace || 'balanced');
        setWeeklyHours(profile.preferences?.weeklyHours || 8);
        setTargetIndustriesInput(profile.preferences?.targetIndustries?.join(', ') || '');
        setHistory(fetchedHistory);

        const restored = hydrateRecommendationFromHistory(fetchedHistory[0]);
        if (restored) {
          setRecommendation(restored);
        }
      })
      .catch(() => {
        authStorage.clearAll();
        router.replace('/login');
      })
      .finally(() => {
        setIsAuthChecking(false);
      });
  }, [router]);

  useEffect(() => {
    const maybeOpenFromQuery = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('profile') !== '1') {
        return;
      }

      setIsProfilePanelOpen(true);
      params.delete('profile');
      const nextSearch = params.toString();
      const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', nextUrl);
    };

    const openFromEvent = () => {
      setIsProfilePanelOpen(true);
    };

    maybeOpenFromQuery();
    window.addEventListener(OPEN_PROFILE_PANEL_EVENT, openFromEvent);

    return () => {
      window.removeEventListener(OPEN_PROFILE_PANEL_EVENT, openFromEvent);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    try {
      const raw = localStorage.getItem(goalStorageKey(user.id));
      if (!raw) {
        setSavedGoals([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSavedGoals(parsed);
      }
    } catch {
      setSavedGoals([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    localStorage.setItem(goalStorageKey(user.id), JSON.stringify(savedGoals));
  }, [savedGoals, user?.id]);

  const parsedSkills = useMemo(() => parseTags(skillsInput), [skillsInput]);
  const parsedInterests = useMemo(() => parseTags(interestsInput), [interestsInput]);
  const parsedTargetIndustries = useMemo(() => parseTags(targetIndustriesInput), [targetIndustriesInput]);
  const activityDates = useMemo(() => {
    const dates: string[] = [];

    history.forEach((item) => {
      if (item.createdAt) {
        dates.push(item.createdAt);
      }
    });

    savedGoals.forEach((goal) => {
      if (goal.createdAt) {
        dates.push(goal.createdAt);
      }
      if (goal.completedAt) {
        dates.push(goal.completedAt);
      }
    });

    return dates;
  }, [history, savedGoals]);

  const recommendations = recommendation?.recommendations || [];
  const bestCareerPath = recommendation?.bestCareerPath || null;

  const filteredRecommendations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return recommendations;
    }

    return recommendations.filter((item) => {
      const searchable = [
        item.title,
        item.description,
        item.explanation,
        ...item.recommendedJobRoles,
        ...item.recommendedSkillsToLearn,
        ...item.skillGap,
        ...item.suggestedCourses.map((course) => `${course.title} ${course.provider}`),
        ...item.projectIdeas
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [recommendations, searchQuery]);

  const topRecommendations = filteredRecommendations.slice(0, 3);
  const activeBestCareerPath = filteredRecommendations[0] || (searchQuery ? null : bestCareerPath);
  const hasProfileSignals = parsedSkills.length >= 3 && parsedInterests.length >= 2;
  const hasResumeSignal = Boolean(resumeAnalysis?.resumeText || user?.resumeURL);
  const hasRecommendations = recommendations.length > 0;
  const activeOperations = [
    isSavingProfile ? 'Saving profile signals...' : null,
    isAnalyzingResume ? 'Analyzing resume...' : null,
    isGenerating ? 'Generating recommendations...' : null
  ].filter(Boolean) as string[];

  const logout = async () => {
    await clearGoogleSessionHint().catch(() => null);
    setIsProfilePanelOpen(false);
    authStorage.clearAll();
    router.push('/login');
  };

  const analyzeResume = async () => {
    if (!resumeFile) {
      toast.error('Select a PDF resume first');
      return;
    }

    setIsAnalyzingResume(true);
    try {
      const analysis = await apiClient.analyzeResume(resumeFile);
      setResumeAnalysis(analysis);
      setResumeText(analysis.resumeText);

      if (analysis.extractedSkills.length) {
        const merged = new Set([...parsedSkills, ...analysis.extractedSkills]);
        setSkillsInput(Array.from(merged).join(', '));
      }

      setLastError(null);
      toast.success('Resume analyzed successfully');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Resume analysis failed';
      setLastError(message);
      toast.error(message);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const saveProfile = async (closeAfterSave = false) => {
    setIsSavingProfile(true);
    try {
      const normalizedName = profileName.trim() || user?.name || 'User';
      const normalizedAvatarUrl = avatarUrlInput.trim();
      const updated = await apiClient.updateProfile({
        name: normalizedName,
        avatarUrl: normalizedAvatarUrl ? normalizedAvatarUrl : null,
        skills: parsedSkills,
        interests: parsedInterests,
        experienceLevel,
        preferences: {
          desiredWorkStyle,
          learningPace,
          weeklyHours,
          targetIndustries: parsedTargetIndustries
        }
      });
      setUser(updated);
      setProfileName(updated.name || '');
      setAvatarUrlInput(updated.avatarUrl || '');
      if (closeAfterSave) {
        setIsProfilePanelOpen(false);
      }
      setLastError(null);
      toast.success('Profile updated');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to update profile';
      setLastError(message);
      toast.error(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const result = await apiClient.getRecommendations({
        skills: parsedSkills,
        interests: parsedInterests,
        experienceLevel,
        resumeText,
        topK,
        preferences: {
          desiredWorkStyle,
          learningPace,
          weeklyHours,
          targetIndustries: parsedTargetIndustries
        }
      });
      setRecommendation(result);
      const refreshedHistory = await apiClient.getRecommendationHistory().catch(() => history);
      setHistory(refreshedHistory);
      setLastError(null);
      toast.success('Recommendations generated');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to generate recommendations';
      setLastError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const addGoal = (goal: { title: string; targetDate?: string; linkedSkill?: string }) => {
    const normalizedTitle = goal.title.trim().toLowerCase();
    if (savedGoals.some((item) => item.title.trim().toLowerCase() === normalizedTitle)) {
      toast.error('Goal already exists');
      return;
    }

    setSavedGoals((current) => [
      {
        id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: goal.title.trim(),
        targetDate: goal.targetDate,
        linkedSkill: goal.linkedSkill,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);
  };

  const toggleGoal = (goalId: string) => {
    setSavedGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              completedAt: goal.completedAt ? undefined : new Date().toISOString()
            }
          : goal
      )
    );
  };

  const deleteGoal = (goalId: string) => {
    setSavedGoals((current) => current.filter((goal) => goal.id !== goalId));
  };

  if (isAuthChecking) {
    return (
      <main className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
          <div className="hidden rounded-2xl border border-border/80 bg-white/80 p-4 lg:block">
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
            <div className="mt-5 space-y-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={`sidebar-skeleton-${index}`} className="h-9 animate-pulse rounded-md bg-muted/80" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-14 animate-pulse rounded-2xl border border-border/70 bg-white/70" />
            <div className="h-32 animate-pulse rounded-2xl border border-border/70 bg-white/70" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`kpi-skeleton-${index}`} className="h-28 animate-pulse rounded-2xl border border-border/70 bg-white/70" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_340px]">
        <DashboardSidebar
          userName={user?.name || 'Career Explorer'}
          userAvatarUrl={user?.avatarUrl || null}
          onOpenProfile={() => setIsProfilePanelOpen(true)}
        />

        <section className="min-w-0">
          <DashboardTopBar
            userName={user?.name || 'User'}
            userEmail={user?.email || ''}
            userAvatarUrl={user?.avatarUrl || null}
            onOpenProfile={() => setIsProfilePanelOpen(true)}
            onLogout={logout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="space-y-4 pb-8">
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-panel"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">AI Career Engine</p>
                  <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight">Career Command Center</h1>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Manage your profile signals, run recommendation cycles, and track actionable progress across jobs,
                    projects, and career milestones.
                  </p>
                </div>

                {activeBestCareerPath ? (
                  <div className="rounded-xl border border-border/70 bg-secondary/45 p-3">
                    <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                      Best Current Match
                    </div>
                    <p className="mt-2 text-base font-semibold">{activeBestCareerPath.title}</p>
                    <p className="text-sm text-muted-foreground">{activeBestCareerPath.suitabilityScore}% suitability</p>
                  </div>
                ) : null}
              </div>
            </motion.section>

            <OnboardingJourney
              hasProfileSignals={hasProfileSignals}
              hasResume={hasResumeSignal}
              hasRecommendations={hasRecommendations}
              goalsCount={savedGoals.length}
              isSavingProfile={isSavingProfile}
              isAnalyzingResume={isAnalyzingResume}
              isGenerating={isGenerating}
            />

            {activeOperations.length ? (
              <Card>
                <CardContent className="flex flex-wrap items-center gap-2 pt-6 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <p className="font-medium text-foreground">In progress:</p>
                  {activeOperations.map((status) => (
                    <Badge key={status} variant="outline">
                      {status}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {lastError ? (
              <Card className="border-danger/45 bg-danger/5">
                <CardContent className="flex items-start gap-2 pt-6 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-danger" />
                  <div>
                    <p className="font-medium text-danger">Action failed</p>
                    <p className="text-danger/90">{lastError}</p>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <AnalyticsCards recommendation={recommendation} skillCount={parsedSkills.length} history={history} />

            <div className="grid gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
              <Card id="resume">
                <CardHeader>
                  <CardTitle className="text-lg">Profile & Resume Workbench</CardTitle>
                  <CardDescription>Update your signals before generating recommendations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        value={skillsInput}
                        onChange={(event) => setSkillsInput(event.target.value)}
                        placeholder="python, sql, react, docker"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="interests">Interests</Label>
                      <Input
                        id="interests"
                        value={interestsInput}
                        onChange={(event) => setInterestsInput(event.target.value)}
                        placeholder="analytics, ai, product strategy"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="experience">Experience</Label>
                      <Select
                        id="experience"
                        value={experienceLevel}
                        onChange={(event) => setExperienceLevel(event.target.value as 'entry' | 'mid' | 'senior')}
                      >
                        <option value="entry">Entry</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="workstyle">Work Style</Label>
                      <Select
                        id="workstyle"
                        value={desiredWorkStyle}
                        onChange={(event) =>
                          setDesiredWorkStyle(event.target.value as 'remote' | 'hybrid' | 'onsite' | 'any')
                        }
                      >
                        <option value="any">Any</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">Onsite</option>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pace">Career Prep Pace</Label>
                      <Select
                        id="pace"
                        value={learningPace}
                        onChange={(event) => setLearningPace(event.target.value as 'casual' | 'balanced' | 'intensive')}
                      >
                        <option value="casual">Casual</option>
                        <option value="balanced">Balanced</option>
                        <option value="intensive">Intensive</option>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="topk">Recommendation Count</Label>
                      <Input
                        id="topk"
                        type="number"
                        min={1}
                        max={10}
                        value={topK}
                        onChange={(event) => setTopK(Math.min(10, Math.max(1, Number(event.target.value) || 1)))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="hours">Weekly Career Prep Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        min={1}
                        max={40}
                        value={weeklyHours}
                        onChange={(event) =>
                          setWeeklyHours(Math.min(40, Math.max(1, Number(event.target.value) || 1)))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="industry">Target Industries</Label>
                      <Input
                        id="industry"
                        value={targetIndustriesInput}
                        onChange={(event) => setTargetIndustriesInput(event.target.value)}
                        placeholder="fintech, healthtech, ecommerce"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="resume-text">Resume Text (Optional)</Label>
                    <Textarea
                      id="resume-text"
                      value={resumeText}
                      onChange={(event) => setResumeText(event.target.value)}
                      placeholder="Paste resume text here or extract it from PDF."
                    />
                  </div>

                  <div className="space-y-2 rounded-xl border border-dashed border-border/80 bg-secondary/20 p-3">
                    <Label htmlFor="resume-file">Upload Resume (PDF)</Label>
                    <Input
                      id="resume-file"
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={analyzeResume}
                        disabled={isAnalyzingResume}
                      >
                        {isAnalyzingResume ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        Analyze Resume
                      </Button>
                      {resumeAnalysis?.cloudinaryUrl ? (
                        <a
                          href={resumeAnalysis.cloudinaryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-xs font-medium hover:bg-secondary/45"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View Uploaded PDF
                        </a>
                      ) : null}
                    </div>

                    {resumeAnalysis?.extractedSkills?.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {resumeAnalysis.extractedSkills.slice(0, 12).map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => saveProfile()}
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Profile
                    </Button>
                    <Button onClick={generateRecommendations} disabled={isGenerating}>
                      {isGenerating ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        'Generate Recommendations'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <SkillTracker recommendation={recommendation} skills={parsedSkills} />
            </div>

            <RecommendationFeed recommendations={filteredRecommendations} searchQuery={searchQuery} />

            <div className="grid gap-4 2xl:grid-cols-[1.1fr_0.9fr]">
              <RecommendationCompare recommendations={filteredRecommendations} />
              <SavedGoals
                goals={savedGoals}
                suggestedSkills={activeBestCareerPath?.recommendedSkillsToLearn || []}
                onAddGoal={addGoal}
                onToggleGoal={toggleGoal}
                onDeleteGoal={deleteGoal}
              />
            </div>

            <HistoryTimeline history={history} />
            <AchievementBadges activityDates={activityDates} />

            <div className="grid gap-4 2xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Action Items</CardTitle>
                  <CardDescription>High-impact next steps generated from your current top match.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {activeBestCareerPath ? (
                    <>
                      <div className="rounded-lg border border-border/70 bg-secondary/30 p-3">
                        <p className="font-medium">Primary direction: {activeBestCareerPath.title}</p>
                        <p className="mt-1 text-muted-foreground">{activeBestCareerPath.explanation}</p>
                      </div>

                      <div>
                        <p className="mb-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          Learn Next
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeBestCareerPath.recommendedSkillsToLearn.slice(0, 6).map((skill) => (
                            <Badge key={skill} variant="warning">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          Project Sprint Ideas
                        </p>
                        <ul className="list-disc space-y-1 pl-5">
                          {activeBestCareerPath.projectIdeas.slice(0, 4).map((idea) => (
                            <li key={idea}>{idea}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      Generate recommendations to unlock your prioritized action plan.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card id="settings">
                <CardHeader>
                  <CardTitle className="text-lg">Settings</CardTitle>
                  <CardDescription>Account and recommendation profile status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Account</p>
                    <div className="mt-1 flex items-center gap-2">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user?.name || 'User'}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                        />
                      ) : (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Data Signals</p>
                    <p className="mt-1">Skills: {parsedSkills.length}</p>
                    <p>Interests: {parsedInterests.length}</p>
                    <p>Resume Parsed: {hasResumeSignal ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Recommendation Mode</p>
                    <p className="mt-1 capitalize">{learningPace} career prep pace</p>
                    <p className="capitalize">{desiredWorkStyle} work style preference</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <JobFeed recommendations={filteredRecommendations} searchQuery={searchQuery} />
            <LearningHub recommendations={filteredRecommendations} searchQuery={searchQuery} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personalized Insights</CardTitle>
                <CardDescription>Roadmap and role-level guidance for your strongest career path.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeBestCareerPath ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      {activeBestCareerPath.recommendedJobRoles.map((role) => (
                        <Badge key={role} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      {activeBestCareerPath.learningRoadmap.map((step) => (
                        <div key={step.phase} className="rounded-xl border border-border/70 bg-secondary/20 p-3">
                          <p className="font-semibold">{step.phase}</p>
                          <p className="text-xs text-muted-foreground">
                            {step.duration} | {step.weeklyHours} hrs/week
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-foreground/90">
                            {step.objectives.map((objective) => (
                              <li key={objective}>{objective}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Run a recommendation cycle to generate your personalized roadmap and role insights.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="xl:hidden">
              <DashboardRightRail recommendations={topRecommendations} history={history} />
            </div>
          </div>
        </section>

        <aside className="hidden xl:block">
          <div className="sticky top-4">
            <DashboardRightRail recommendations={topRecommendations} history={history} />
          </div>
        </aside>
      </div>

      <ProfilePanel
        isOpen={isProfilePanelOpen}
        onClose={() => setIsProfilePanelOpen(false)}
        userEmail={user?.email || ''}
        displayName={profileName}
        avatarUrl={avatarUrlInput}
        skillsInput={skillsInput}
        interestsInput={interestsInput}
        experienceLevel={experienceLevel}
        desiredWorkStyle={desiredWorkStyle}
        learningPace={learningPace}
        weeklyHours={weeklyHours}
        targetIndustriesInput={targetIndustriesInput}
        isSavingProfile={isSavingProfile}
        activityDates={activityDates}
        onDisplayNameChange={setProfileName}
        onAvatarUrlChange={setAvatarUrlInput}
        onSkillsChange={setSkillsInput}
        onInterestsChange={setInterestsInput}
        onExperienceChange={setExperienceLevel}
        onDesiredWorkStyleChange={setDesiredWorkStyle}
        onLearningPaceChange={setLearningPace}
        onWeeklyHoursChange={setWeeklyHours}
        onTargetIndustriesChange={setTargetIndustriesInput}
        onSaveProfile={() => saveProfile(true)}
      />
    </main>
  );
}
