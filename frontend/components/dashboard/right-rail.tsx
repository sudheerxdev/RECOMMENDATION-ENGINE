'use client';

import { CalendarClock, CheckCircle2, Clock4 } from 'lucide-react';
import { CareerChat } from '@/components/chat/career-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendationHistoryItem, RecommendationItem } from '@/lib/types';

interface DashboardRightRailProps {
  recommendations: RecommendationItem[];
  history: RecommendationHistoryItem[];
}

const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });
const fullDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

const getWeekDates = () => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return {
      dayLabel: dayFormatter.format(date),
      dateNumber: date.getDate(),
      isToday
    };
  });
};

export const DashboardRightRail = ({ recommendations, history }: DashboardRightRailProps) => {
  const weekDates = getWeekDates();
  const best = recommendations[0];
  const topCourse = best?.suggestedCourses?.[0]?.title;
  const topGap = best?.skillGap?.[0];
  const topProject = best?.projectIdeas?.[0];
  const latestRun = history[0];

  const tasks = [
    topGap ? `Close gap: ${topGap}` : 'Analyze updated resume and refresh recommendations.',
    topCourse ? `Complete: ${topCourse}` : 'Complete one priority course module.',
    topProject ? `Draft scope: ${topProject}` : 'Prepare a capstone project brief this weekend.'
  ];

  const activityFeed = [
    best ? `Current top path: ${best.title} (${best.suitabilityScore}% match).` : 'Generate recommendations to unlock live activity signals.',
    history.length ? `Recommendation runs recorded: ${history.length}.` : 'No saved recommendation runs yet.',
    latestRun ? `Last generated ${fullDateFormatter.format(new Date(latestRun.createdAt))}.` : 'Run your first recommendation cycle to start tracking progress.'
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Calendar</CardTitle>
          <CardDescription>Plan your career sprints and learning blocks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {weekDates.map((date) => (
              <span key={`day-${date.dayLabel}-${date.dateNumber}`}>{date.dayLabel}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {weekDates.map((date) => (
              <div
                key={`date-${date.dayLabel}-${date.dateNumber}`}
                className={`rounded-md py-1.5 ${date.isToday ? 'bg-primary font-semibold text-primary-foreground' : 'bg-secondary/45'}`}
              >
                {date.dateNumber}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2 rounded-md bg-secondary/30 px-3 py-2">
            <Clock4 className="mt-0.5 h-4 w-4 text-primary" />
            <p>{tasks[0]}</p>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-secondary/30 px-3 py-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
            <p>{tasks[1]}</p>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-secondary/30 px-3 py-2">
            <CalendarClock className="mt-0.5 h-4 w-4 text-warning" />
            <p>{tasks[2]}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          {activityFeed.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </CardContent>
      </Card>

      <CareerChat recommendations={recommendations} />
    </div>
  );
};
