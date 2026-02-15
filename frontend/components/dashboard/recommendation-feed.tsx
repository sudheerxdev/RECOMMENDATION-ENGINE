'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendationItem } from '@/lib/types';

interface RecommendationFeedProps {
  recommendations: RecommendationItem[];
}

export const RecommendationFeed = ({ recommendations }: RecommendationFeedProps) => {
  return (
    <section id="recommendations" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Recommendation Feed</h2>
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          AI Ranked
        </Badge>
      </div>

      <div className="grid gap-4">
        {recommendations.length ? (
          recommendations.map((item, index) => (
            <motion.div
              key={item.careerPathId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.04 * index }}
            >
              <Card className="hover:-translate-y-0.5 transition-transform">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant={item.suitabilityScore > 74 ? 'success' : 'warning'}>
                      {item.suitabilityScore}% match
                    </Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{item.explanation}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.recommendedSkillsToLearn.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">No Recommendations Yet</CardTitle>
              <CardDescription>
                Complete your profile and click "Generate Recommendations" to populate this feed.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </section>
  );
};
