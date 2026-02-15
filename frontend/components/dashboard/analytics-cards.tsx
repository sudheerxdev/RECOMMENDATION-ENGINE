'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Award, Briefcase, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendationResponse } from '@/lib/types';

interface AnalyticsCardsProps {
  recommendation: RecommendationResponse | null;
  skillCount: number;
}

const weeklyData = [
  { day: 'Mon', score: 42 },
  { day: 'Tue', score: 48 },
  { day: 'Wed', score: 52 },
  { day: 'Thu', score: 58 },
  { day: 'Fri', score: 64 },
  { day: 'Sat', score: 69 },
  { day: 'Sun', score: 74 }
];

export const AnalyticsCards = ({ recommendation, skillCount }: AnalyticsCardsProps) => {
  const bestScore = recommendation?.bestCareerPath?.suitabilityScore || 0;
  const recommendationCount = recommendation?.recommendations?.length || 0;
  const gapCount = recommendation?.bestCareerPath?.skillGap?.length || 0;

  const radialData = [{ name: 'Career Score', value: bestScore, fill: 'hsl(var(--primary))' }];

  return (
    <section id="dashboard" className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-4">
        {[
          { label: 'Career Match Score', value: `${bestScore}%`, icon: Award, meta: '+8% this week' },
          { label: 'Skills Tracked', value: String(skillCount), icon: TrendingUp, meta: 'Profile enriched' },
          { label: 'Active Recommendations', value: String(recommendationCount), icon: Briefcase, meta: 'Fresh ranking' },
          { label: 'Priority Skill Gaps', value: String(gapCount), icon: ArrowUpRight, meta: 'Action required' }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * index, duration: 0.25 }}
          >
            <Card className="hover:-translate-y-0.5 transition-transform">
              <CardHeader className="pb-2">
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-2xl">{item.value}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.meta}</span>
                <item.icon className="h-4 w-4 text-primary" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Career Score Trend</CardTitle>
            <CardDescription>Weekly trajectory based on profile and learning activity.</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Readiness Gauge</CardTitle>
            <CardDescription>Top-path suitability overview.</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={18} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="-mt-6 text-center text-sm font-medium text-muted-foreground">Current score: {bestScore}%</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
