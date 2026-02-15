'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Compass, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Recommendation Engine',
    description:
      'Combines embedding similarity, skill normalization, and reasoning to rank career paths with suitability scores.'
  },
  {
    icon: Compass,
    title: 'Skill Gap Analysis',
    description:
      'Identifies missing skills for target roles, recommends what to learn first, and maps project milestones.'
  },
  {
    icon: Target,
    title: 'Personalized Learning Roadmap',
    description:
      'Builds phased learning plans with effort pacing, suggested courses, and role-specific capstone ideas.'
  }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-16 pt-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI Career Recommendation Engine Platform
          </div>
          <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Build a clear career direction from your skills, resume, and goals.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Get ranked career recommendations, suitability scores, skill-gap analysis, course suggestions, project
            ideas, and a practical roadmap in minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start For Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                Open Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.07, duration: 0.45 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-3 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-6">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
