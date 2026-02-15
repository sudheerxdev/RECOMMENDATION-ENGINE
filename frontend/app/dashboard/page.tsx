'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BrainCircuit, FileText, Loader2, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsCards } from '@/components/dashboard/analytics-cards';
import { JobFeed } from '@/components/dashboard/job-feed';
import { LearningHub } from '@/components/dashboard/learning-hub';
import { RecommendationFeed } from '@/components/dashboard/recommendation-feed';
import { DashboardRightRail } from '@/components/dashboard/right-rail';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { SkillTracker } from '@/components/dashboard/skill-tracker';
import { DashboardTopBar } from '@/components/dashboard/top-bar';
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
import type { RecommendationResponse, ResumeAnalysis, User } from '@/lib/types';
import { parseTags } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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

    apiClient
      .me()
      .then((profile) => {
        setUser(profile);
        setSkillsInput(profile.skills.join(', '));
        setInterestsInput(profile.interests.join(', '));
        setExperienceLevel(profile.experienceLevel);
        setDesiredWorkStyle(profile.preferences?.desiredWorkStyle || 'any');
        setLearningPace(profile.preferences?.learningPace || 'balanced');
        setTargetIndustriesInput(profile.preferences?.targetIndustries?.join(', ') || '');
      })
      .catch(() => {
        authStorage.clearAll();
        router.replace('/login');
      })
      .finally(() => {
        setIsAuthChecking(false);
      });
  }, [router]);

  const parsedSkills = useMemo(() => parseTags(skillsInput), [skillsInput]);
  const parsedInterests = useMemo(() => parseTags(interestsInput), [interestsInput]);
  const parsedTargetIndustries = useMemo(() => parseTags(targetIndustriesInput), [targetIndustriesInput]);

  const recommendations = recommendation?.recommendations || [];
  const topRecommendations = recommendations.slice(0, 3);
  const bestCareerPath = recommendation?.bestCareerPath || null;

  const logout = async () => {
    await clearGoogleSessionHint().catch(() => null);
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

      toast.success('Resume analyzed successfully');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Resume analysis failed';
      toast.error(message);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const updated = await apiClient.updateProfile({
        skills: parsedSkills,
        interests: parsedInterests,
        experienceLevel,
        preferences: {
          desiredWorkStyle,
          learningPace,
          targetIndustries: parsedTargetIndustries
        }
      });
      setUser(updated);
      toast.success('Profile updated');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to update profile';
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
      toast.success('Recommendations generated');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to generate recommendations';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isAuthChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="page-shell min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_340px]">
        <DashboardSidebar userName={user?.name || 'Career Explorer'} />

        <section className="min-w-0">
          <DashboardTopBar
            userName={user?.name || 'User'}
            userEmail={user?.email || ''}
            onLogout={logout}
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
                    projects, and learning milestones.
                  </p>
                </div>

                {bestCareerPath ? (
                  <div className="rounded-xl border border-border/70 bg-secondary/45 p-3">
                    <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                      Best Current Match
                    </div>
                    <p className="mt-2 text-base font-semibold">{bestCareerPath.title}</p>
                    <p className="text-sm text-muted-foreground">{bestCareerPath.suitabilityScore}% suitability</p>
                  </div>
                ) : null}
              </div>
            </motion.section>

            <AnalyticsCards recommendation={recommendation} skillCount={parsedSkills.length} />

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
                      <Label htmlFor="pace">Learning Pace</Label>
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
                      <Label htmlFor="hours">Weekly Learning Hours</Label>
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
                      onClick={saveProfile}
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

            <RecommendationFeed recommendations={recommendations} />

            <div className="grid gap-4 2xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Action Items</CardTitle>
                  <CardDescription>High-impact next steps generated from your current top match.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {bestCareerPath ? (
                    <>
                      <div className="rounded-lg border border-border/70 bg-secondary/30 p-3">
                        <p className="font-medium">Primary direction: {bestCareerPath.title}</p>
                        <p className="mt-1 text-muted-foreground">{bestCareerPath.explanation}</p>
                      </div>

                      <div>
                        <p className="mb-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          Learn Next
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {bestCareerPath.recommendedSkillsToLearn.slice(0, 6).map((skill) => (
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
                          {bestCareerPath.projectIdeas.slice(0, 4).map((idea) => (
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
                    <p className="mt-1 font-medium">{user?.name}</p>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Data Signals</p>
                    <p className="mt-1">Skills: {parsedSkills.length}</p>
                    <p>Interests: {parsedInterests.length}</p>
                    <p>Resume Parsed: {resumeAnalysis ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Recommendation Mode</p>
                    <p className="mt-1 capitalize">{learningPace} learning pace</p>
                    <p className="capitalize">{desiredWorkStyle} work style preference</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <JobFeed recommendations={recommendations} />
            <LearningHub recommendations={recommendations} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personalized Insights</CardTitle>
                <CardDescription>Roadmap and role-level guidance for your strongest career path.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bestCareerPath ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      {bestCareerPath.recommendedJobRoles.map((role) => (
                        <Badge key={role} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      {bestCareerPath.learningRoadmap.map((step) => (
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
              <DashboardRightRail recommendations={topRecommendations} />
            </div>
          </div>
        </section>

        <aside className="hidden xl:block">
          <div className="sticky top-4">
            <DashboardRightRail recommendations={topRecommendations} />
          </div>
        </aside>
      </div>
    </main>
  );
}
