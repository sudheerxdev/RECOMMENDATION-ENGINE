'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { RecommendationResponse } from '@/lib/types';

interface SkillTrackerProps {
  recommendation: RecommendationResponse | null;
  skills: string[];
}

const fallbackSkills = [
  { skill: 'problem solving', readiness: 65 },
  { skill: 'system design', readiness: 48 },
  { skill: 'communication', readiness: 72 }
];

export const SkillTracker = ({ recommendation, skills }: SkillTrackerProps) => {
  const missing = recommendation?.bestCareerPath?.skillGap || [];

  const trackedSkills =
    skills.slice(0, 5).map((skill, index) => ({
      skill,
      readiness: Math.max(32, Math.min(92, 86 - index * 11))
    })) || [];

  const rows = trackedSkills.length ? trackedSkills : fallbackSkills;

  return (
    <Card id="skills">
      <CardHeader>
        <CardTitle className="text-lg">Skill Tracker</CardTitle>
        <CardDescription>Track your current strengths and close high-impact gaps.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row, index) => (
          <motion.div
            key={row.skill}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.04 * index, duration: 0.2 }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium capitalize">{row.skill}</span>
              <span className="text-muted-foreground">{row.readiness}%</span>
            </div>
            <Progress value={row.readiness} />
          </motion.div>
        ))}

        <div className="rounded-lg border border-border/80 bg-secondary/35 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Priority Gaps</p>
          <p className="mt-1.5 text-sm text-foreground/90">
            {missing.length ? missing.slice(0, 4).join(', ') : 'No critical gaps detected yet.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
