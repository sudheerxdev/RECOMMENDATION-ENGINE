'use client';

import { motion } from 'framer-motion';
import { BarChart3, BookOpen, Briefcase, Lightbulb, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { RecommendationResponse } from '@/lib/types';
import { formatScoreTone } from '@/lib/utils';

interface RecommendationResultsProps {
  result: RecommendationResponse | null;
}

export const RecommendationResults = ({ result }: RecommendationResultsProps) => {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Recommendations Yet</CardTitle>
          <CardDescription>
            Submit your profile and resume data to generate personalized career recommendations.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {result.recommendations.map((item, index) => {
        const scoreTone = formatScoreTone(item.suitabilityScore);
        return (
          <motion.div
            key={item.careerPathId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index, duration: 0.35 }}
          >
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <CardDescription className="mt-2 max-w-3xl text-sm leading-6">{item.description}</CardDescription>
                  </div>
                  <Badge variant={scoreTone}>{item.suitabilityScore}% fit</Badge>
                </div>
                <Progress value={item.suitabilityScore} />
                <p className="text-sm text-muted-foreground">{item.explanation}</p>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <section className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Score Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(item.scoreBreakdown).map(([key, value]) => (
                      <div key={key} className="rounded bg-white/80 px-3 py-2">
                        <p className="text-xs uppercase text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="font-semibold">{value}%</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Skills
                  </h4>
                  <div>
                    <p className="mb-1 text-xs uppercase text-muted-foreground">Matched Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.matchedSkills.length ? (
                        item.matchedSkills.map((skill) => (
                          <Badge key={skill} variant="success">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">None detected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase text-muted-foreground">Skill Gaps</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.skillGap.length ? (
                        item.skillGap.map((skill) => (
                          <Badge key={skill} variant="danger">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No major gaps</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase text-muted-foreground">Learn Next</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.recommendedSkillsToLearn.map((skill) => (
                        <Badge key={skill} variant="warning">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Suggested Courses
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {item.suggestedCourses.length ? (
                      item.suggestedCourses.map((course) => (
                        <li key={`${item.careerPathId}-${course.title}`} className="rounded bg-white/70 px-3 py-2">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-primary hover:underline"
                          >
                            {course.title}
                          </a>
                          <p className="text-xs text-muted-foreground">
                            {course.provider} • {course.type}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No course suggestions available.</li>
                    )}
                  </ul>
                </section>

                <section className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Job Roles & Projects
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.recommendedJobRoles.map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/90">
                    {item.projectIdeas.map((idea) => (
                      <li key={idea}>{idea}</li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-3 rounded-md border border-border bg-muted/30 p-4 md:col-span-2">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    Personalized Career Roadmap
                  </h4>
                  <div className="grid gap-3 md:grid-cols-3">
                    {item.learningRoadmap.map((step) => (
                      <div key={`${item.careerPathId}-${step.phase}`} className="rounded bg-white/75 p-3">
                        <p className="text-sm font-semibold">{step.phase}</p>
                        <p className="text-xs text-muted-foreground">
                          {step.duration} • {step.weeklyHours}h/week
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-foreground/90">
                          {step.objectives.map((objective) => (
                            <li key={objective}>{objective}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
