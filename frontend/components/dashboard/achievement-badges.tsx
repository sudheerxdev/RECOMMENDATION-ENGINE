'use client';

import { Award, Flame, Footprints, Rocket, ShieldCheck, Star, Trophy } from 'lucide-react';
import { getActivityStats } from '@/components/dashboard/activity-heatmap';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AchievementBadgesProps {
  activityDates: string[];
}

interface BadgeRule {
  id: string;
  label: string;
  description: string;
  icon: typeof Award;
  target: number;
  progress: number;
}

export const AchievementBadges = ({ activityDates }: AchievementBadgesProps) => {
  const stats = getActivityStats(activityDates);

  const badgeRules: BadgeRule[] = [
    {
      id: 'active-days',
      label: 'Active Days',
      description: 'Be active across different days during the year.',
      icon: Footprints,
      target: 50,
      progress: stats.activeDays
    },
    {
      id: 'starter-streak',
      label: 'Starter Streak',
      description: 'Maintain at least a 7-day streak.',
      icon: Flame,
      target: 7,
      progress: stats.maxStreak
    },
    {
      id: 'consistency-pro',
      label: 'Consistency Pro',
      description: 'Reach a 30-day max streak.',
      icon: Trophy,
      target: 30,
      progress: stats.maxStreak
    },
    {
      id: 'momentum-100',
      label: 'Momentum 100',
      description: 'Complete 100 total actions this year.',
      icon: Rocket,
      target: 100,
      progress: stats.totalActions
    },
    {
      id: 'deep-focus',
      label: 'Deep Focus',
      description: 'Complete 250 total actions.',
      icon: Star,
      target: 250,
      progress: stats.totalActions
    },
    {
      id: 'elite-operator',
      label: 'Elite Operator',
      description: 'Unlock by reaching 100 active days.',
      icon: ShieldCheck,
      target: 100,
      progress: stats.activeDays
    }
  ];

  return (
    <section id="badges" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={stats.activeDays > 0 ? 'success' : 'outline'}>{stats.activeDays} active days</Badge>
          <Badge variant="outline">{stats.totalActions} total actions</Badge>
          <Badge variant={stats.currentStreak > 0 ? 'success' : 'outline'}>{stats.currentStreak} day streak</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {badgeRules.map((rule) => {
          const progress = Math.min(100, Math.round((rule.progress / rule.target) * 100));
          const unlocked = rule.progress >= rule.target;

          return (
            <Card key={rule.id} className={unlocked ? 'border-success/35' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="inline-flex items-center gap-2 text-base">
                    <rule.icon className={`h-4 w-4 ${unlocked ? 'text-success' : 'text-muted-foreground'}`} />
                    {rule.label}
                  </CardTitle>
                  <Badge variant={unlocked ? 'success' : 'outline'}>{unlocked ? 'Unlocked' : 'Locked'}</Badge>
                </div>
                <CardDescription>{rule.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/45">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-success" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {rule.progress}/{rule.target} progress ({progress}%)
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
