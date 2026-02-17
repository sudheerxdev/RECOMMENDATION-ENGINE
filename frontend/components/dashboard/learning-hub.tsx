'use client';

import { BookOpenText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendationItem } from '@/lib/types';

interface LearningHubProps {
  recommendations: RecommendationItem[];
  searchQuery?: string;
}

export const LearningHub = ({ recommendations, searchQuery = '' }: LearningHubProps) => {
  const courses = recommendations.flatMap((item) => item.suggestedCourses).slice(0, 6);

  return (
    <section id="learning" className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Career Resource Hub</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.length ? (
          courses.map((course, index) => (
            <Card key={`${course.title}-${index}`} className="hover:shadow-md transition-shadow">
              {course.imageUrl ? (
                <div className="h-32 overflow-hidden rounded-t-lg border-b border-border/70 bg-secondary/25">
                  <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="h-10 rounded-t-lg border-b border-border/70 bg-gradient-to-r from-primary/18 via-accent/10 to-primary/14" />
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{course.title}</CardTitle>
                    <CardDescription>{course.provider}</CardDescription>
                  </div>
                  <Badge variant="outline">{course.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <BookOpenText className="h-4 w-4" />
                  Open Course
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
                <CardTitle className="text-base">{searchQuery ? 'No Courses Match Current Search' : 'No Courses Yet'}</CardTitle>
                <CardDescription>
                  {searchQuery
                    ? 'Clear search to see personalized courses for your recommended roles.'
                    : 'Generate recommendations to unlock tailored career resources.'}
                </CardDescription>
              </CardHeader>
            </Card>
        )}
      </div>
    </section>
  );
};
