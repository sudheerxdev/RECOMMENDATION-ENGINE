'use client';

import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OnboardingJourneyProps {
  hasProfileSignals: boolean;
  hasResume: boolean;
  hasRecommendations: boolean;
  goalsCount: number;
  isSavingProfile: boolean;
  isAnalyzingResume: boolean;
  isGenerating: boolean;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  anchor: string;
  completed: boolean;
  isBusy: boolean;
}

export const OnboardingJourney = ({
  hasProfileSignals,
  hasResume,
  hasRecommendations,
  goalsCount,
  isSavingProfile,
  isAnalyzingResume,
  isGenerating
}: OnboardingJourneyProps) => {
  const steps: JourneyStep[] = [
    {
      id: 'profile',
      title: 'Complete profile signals',
      description: 'Add skills, interests, and preferences for better recommendation fit.',
      anchor: '#resume',
      completed: hasProfileSignals,
      isBusy: isSavingProfile
    },
    {
      id: 'resume',
      title: 'Analyze your resume',
      description: 'Upload a PDF so skills and project context are extracted automatically.',
      anchor: '#resume',
      completed: hasResume,
      isBusy: isAnalyzingResume
    },
    {
      id: 'recommendation',
      title: 'Generate first recommendation set',
      description: 'Run the model once to unlock roadmap, compare, and timeline modules.',
      anchor: '#recommendations',
      completed: hasRecommendations,
      isBusy: isGenerating
    },
    {
      id: 'goals',
      title: 'Save at least one goal',
      description: 'Track what you want to complete next so momentum stays visible.',
      anchor: '#goals',
      completed: goalsCount > 0,
      isBusy: false
    }
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const completion = Math.round((completedSteps / steps.length) * 100);

  return (
    <Card id="journey" className="overflow-hidden">
      <CardHeader className="border-b border-border/70 bg-white/70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="inline-flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              Onboarding Journey
            </CardTitle>
            <CardDescription>Finish these milestones to unlock full platform value.</CardDescription>
          </div>
          <Badge variant={completion === 100 ? 'success' : 'outline'}>{completion}% complete</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Progress value={completion} className="h-2.5" />
        <div className="grid gap-2 lg:grid-cols-2">
          {steps.map((step) => (
            <a
              key={step.id}
              href={step.anchor}
              className="rounded-xl border border-border/70 bg-secondary/20 px-3 py-2.5 transition-colors hover:bg-secondary/35"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5">
                  {step.isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : step.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

