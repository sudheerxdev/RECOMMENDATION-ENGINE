'use client';

import { BookOpenText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendationItem } from '@/lib/types';

interface LearningHubProps {
  recommendations: RecommendationItem[];
}

export const LearningHub = ({ recommendations }: LearningHubProps) => {
  const courses = recommendations.flatMap((item) => item.suggestedCourses).slice(0, 6);

  return (
    <section id="learning" className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Learning Hub</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.length ? (
          courses.map((course, index) => (
            <Card key={`${course.title}-${index}`} className="hover:shadow-md transition-shadow">
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
              <CardTitle className="text-base">No Courses Yet</CardTitle>
              <CardDescription>Generate recommendations to unlock tailored learning resources.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </section>
  );
};
