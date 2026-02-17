'use client';

import { useEffect, useMemo, useState } from 'react';
import { GitCompareArrows, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import type { RecommendationItem } from '@/lib/types';

interface RecommendationCompareProps {
  recommendations: RecommendationItem[];
}

const METRICS: Array<{ key: keyof RecommendationItem['scoreBreakdown']; label: string }> = [
  { key: 'embeddingScore', label: 'Profile semantic fit' },
  { key: 'skillMatchScore', label: 'Required skill match' },
  { key: 'interestScore', label: 'Interest alignment' },
  { key: 'experienceScore', label: 'Experience fit' },
  { key: 'preferenceScore', label: 'Preference fit' },
  { key: 'popularityScore', label: 'Market momentum' }
];

export const RecommendationCompare = ({ recommendations }: RecommendationCompareProps) => {
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');

  useEffect(() => {
    if (!recommendations.length) {
      setLeftId('');
      setRightId('');
      return;
    }

    const first = recommendations[0]?.careerPathId || '';
    const second = recommendations[1]?.careerPathId || recommendations[0]?.careerPathId || '';

    setLeftId((current) => (recommendations.some((item) => item.careerPathId === current) ? current : first));
    setRightId((current) => (recommendations.some((item) => item.careerPathId === current) ? current : second));
  }, [recommendations]);

  const left = useMemo(
    () => recommendations.find((item) => item.careerPathId === leftId) || null,
    [recommendations, leftId]
  );

  const right = useMemo(
    () => recommendations.find((item) => item.careerPathId === rightId) || null,
    [recommendations, rightId]
  );

  if (recommendations.length < 2) {
    return (
      <Card id="compare">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-lg">
            <GitCompareArrows className="h-4 w-4 text-primary" />
            Recommendation Compare View
          </CardTitle>
          <CardDescription>Generate at least two recommendations to compare role fit side-by-side.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card id="compare" className="overflow-hidden">
      <CardHeader className="border-b border-border/70 bg-white/70">
        <CardTitle className="inline-flex items-center gap-2 text-lg">
          <GitCompareArrows className="h-4 w-4 text-primary" />
          Recommendation Compare View
        </CardTitle>
        <CardDescription>Compare two paths before committing your next learning sprint.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-2 md:grid-cols-2">
          <Select value={leftId} onChange={(event) => setLeftId(event.target.value)}>
            {recommendations.map((item) => (
              <option key={`left-${item.careerPathId}`} value={item.careerPathId}>
                {item.title}
              </option>
            ))}
          </Select>
          <Select value={rightId} onChange={(event) => setRightId(event.target.value)}>
            {recommendations.map((item) => (
              <option key={`right-${item.careerPathId}`} value={item.careerPathId}>
                {item.title}
              </option>
            ))}
          </Select>
        </div>

        {left && right ? (
          <div className="space-y-3">
            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded-xl border border-border/75 bg-secondary/25 p-3">
                <p className="text-sm font-semibold">{left.title}</p>
                <p className="text-xs text-muted-foreground">{left.suitabilityScore}% overall suitability</p>
              </div>
              <div className="rounded-xl border border-border/75 bg-secondary/25 p-3">
                <p className="text-sm font-semibold">{right.title}</p>
                <p className="text-xs text-muted-foreground">{right.suitabilityScore}% overall suitability</p>
              </div>
            </div>

            <div className="space-y-2">
              {METRICS.map((metric) => {
                const leftValue = left.scoreBreakdown[metric.key];
                const rightValue = right.scoreBreakdown[metric.key];
                const winner = leftValue === rightValue ? 'tie' : leftValue > rightValue ? 'left' : 'right';

                return (
                  <div
                    key={metric.key}
                    className="grid items-center gap-2 rounded-lg border border-border/70 bg-white/65 px-3 py-2 md:grid-cols-[1fr_auto_1fr]"
                  >
                    <p className={`text-sm ${winner === 'left' ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {leftValue}%
                    </p>
                    <p className="text-center text-xs uppercase tracking-[0.15em] text-muted-foreground">{metric.label}</p>
                    <p className={`text-right text-sm ${winner === 'right' ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {rightValue}%
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
              <p className="inline-flex items-center gap-2 text-sm font-medium">
                <Trophy className="h-4 w-4 text-warning" />
                Suggested pick:{' '}
                <span>{left.suitabilityScore >= right.suitabilityScore ? left.title : right.title}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(left.suitabilityScore >= right.suitabilityScore ? left.recommendedSkillsToLearn : right.recommendedSkillsToLearn)
                  .slice(0, 4)
                  .map((skill) => (
                    <Badge key={skill} variant="warning">
                      {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

