'use client';

import { CalendarClock, CheckCircle2, Clock4 } from 'lucide-react';
import { CareerChat } from '@/components/chat/career-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendationItem } from '@/lib/types';

interface DashboardRightRailProps {
  recommendations: RecommendationItem[];
}

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dateNumbers = [11, 12, 13, 14, 15, 16, 17];

export const DashboardRightRail = ({ recommendations }: DashboardRightRailProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Calendar</CardTitle>
          <CardDescription>Plan your career sprints and learning blocks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {days.map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {dateNumbers.map((date) => (
              <div
                key={date}
                className={`rounded-md py-1.5 ${date === 15 ? 'bg-primary text-primary-foreground font-semibold' : 'bg-secondary/45'}`}
              >
                {date}
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
            <p>Analyze updated resume and refresh recommendations.</p>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-secondary/30 px-3 py-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
            <p>Complete one priority course module.</p>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-secondary/30 px-3 py-2">
            <CalendarClock className="mt-0.5 h-4 w-4 text-warning" />
            <p>Prepare a capstone project brief this weekend.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>Recommendation model updated ranking weights.</p>
          <p>New learning resources matched to your top role.</p>
          <p>Career assistant generated next-step checklist.</p>
        </CardContent>
      </Card>

      <CareerChat recommendations={recommendations} />
    </div>
  );
};
