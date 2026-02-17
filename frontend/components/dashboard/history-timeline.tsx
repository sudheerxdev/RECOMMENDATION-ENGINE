'use client';

import { Clock3, LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendationHistoryItem } from '@/lib/types';

interface HistoryTimelineProps {
  history: RecommendationHistoryItem[];
}

const scoreFromHistoryItem = (item: RecommendationHistoryItem) => {
  const recommendations = item.recommendationPayload?.recommendations || [];
  if (!recommendations.length) {
    return 0;
  }
  return recommendations[0]?.suitabilityScore || 0;
};

const pathFromHistoryItem = (item: RecommendationHistoryItem) => {
  const recommendations = item.recommendationPayload?.recommendations || [];
  return recommendations[0]?.title || item.careerPaths?.[0] || 'Unknown role';
};

export const HistoryTimeline = ({ history }: HistoryTimelineProps) => {
  if (!history.length) {
    return (
      <Card id="history">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-lg">
            <LineChart className="h-4 w-4 text-primary" />
            Recommendation Timeline
          </CardTitle>
          <CardDescription>Run recommendations to start tracking your decision history.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const sorted = history.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Card id="history" className="overflow-hidden">
      <CardHeader className="border-b border-border/70 bg-white/70">
        <CardTitle className="inline-flex items-center gap-2 text-lg">
          <LineChart className="h-4 w-4 text-primary" />
          Recommendation Timeline
        </CardTitle>
        <CardDescription>Audit model outcomes and how your top-path confidence changes over time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {sorted.slice(0, 10).map((item, index) => {
          const score = scoreFromHistoryItem(item);
          const previousScore = sorted[index + 1] ? scoreFromHistoryItem(sorted[index + 1]) : score;
          const delta = score - previousScore;
          const topPath = pathFromHistoryItem(item);

          return (
            <div key={item._id} className="relative rounded-xl border border-border/75 bg-secondary/20 p-3">
              {index < sorted.length - 1 ? (
                <span className="absolute left-[18px] top-[38px] h-[calc(100%-12px)] w-px bg-border/80" />
              ) : null}

              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Clock3 className="h-3 w-3" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{topPath}</p>
                    <Badge variant={score >= 75 ? 'success' : score >= 50 ? 'warning' : 'outline'}>
                      {score ? `${score}%` : `${item.careerPaths.length} paths`}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {delta > 0 ? `+${delta}% confidence vs previous run` : delta < 0 ? `${delta}% confidence vs previous run` : 'No change vs previous run'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

