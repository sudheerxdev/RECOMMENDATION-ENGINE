'use client';

import { Building2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendationItem } from '@/lib/types';

interface JobFeedProps {
  recommendations: RecommendationItem[];
}

const fallbackJobs = [
  { title: 'Junior ML Engineer', company: 'Nova AI Labs', location: 'Remote' },
  { title: 'Data Analyst Intern', company: 'InsightWorks', location: 'Austin, TX' },
  { title: 'Full Stack Developer', company: 'Orbit Systems', location: 'Hybrid' }
];

export const JobFeed = ({ recommendations }: JobFeedProps) => {
  const dynamicJobs = recommendations
    .flatMap((item) => item.recommendedJobRoles.map((role) => ({ title: role, company: item.title, location: 'Remote' })))
    .slice(0, 4);

  const jobs = dynamicJobs.length ? dynamicJobs : fallbackJobs;

  return (
    <section id="jobs" className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Jobs & Internships</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={`${job.title}-${job.company}`} className="hover:border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {job.company}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <Badge variant="outline">Recommended</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
