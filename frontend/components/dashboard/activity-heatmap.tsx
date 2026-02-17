'use client';

import { useMemo } from 'react';
import { Flame, Footprints, Sparkles, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityHeatmapProps {
  activityDates: string[];
}

interface ActivityDay {
  key: string;
  date: Date;
  count: number;
}

export interface ActivityStats {
  totalActions: number;
  activeDays: number;
  currentStreak: number;
  maxStreak: number;
}

const TOTAL_DAYS = 365;

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const normalizeDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const intensityClass = (count: number) => {
  if (count <= 0) {
    return 'bg-secondary/35';
  }
  if (count === 1) {
    return 'bg-emerald-800/65';
  }
  if (count <= 3) {
    return 'bg-emerald-600/75';
  }
  if (count <= 5) {
    return 'bg-emerald-500/90';
  }
  return 'bg-emerald-400';
};

const buildDayMap = (activityDates: string[]) => {
  const countsByDay = new Map<string, number>();

  activityDates.forEach((value) => {
    const normalized = normalizeDate(value);
    if (!normalized) {
      return;
    }
    const key = dateKey(normalized);
    countsByDay.set(key, (countsByDay.get(key) || 0) + 1);
  });

  return countsByDay;
};

const computeStreaks = (days: ActivityDay[]) => {
  let currentStreak = 0;
  let maxStreak = 0;
  let running = 0;

  days.forEach((day) => {
    if (day.count > 0) {
      running += 1;
      if (running > maxStreak) {
        maxStreak = running;
      }
    } else {
      running = 0;
    }
  });

  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count > 0) {
      currentStreak += 1;
      continue;
    }
    break;
  }

  return { currentStreak, maxStreak };
};

export const getActivityStats = (activityDates: string[]): ActivityStats => {
  const countsByDay = buildDayMap(activityDates);
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (TOTAL_DAYS - 1));

  const days = Array.from({ length: TOTAL_DAYS }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      key: dateKey(date),
      date,
      count: countsByDay.get(dateKey(date)) || 0
    };
  });

  const totalActions = days.reduce((sum, day) => sum + day.count, 0);
  const activeDays = days.filter((day) => day.count > 0).length;
  const streaks = computeStreaks(days);

  return {
    totalActions,
    activeDays,
    currentStreak: streaks.currentStreak,
    maxStreak: streaks.maxStreak
  };
};

const buildHeatmapWeeks = (activityDates: string[]) => {
  const countsByDay = buildDayMap(activityDates);
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (TOTAL_DAYS - 1));

  const alignedStart = new Date(start);
  alignedStart.setDate(start.getDate() - start.getDay());

  const days: ActivityDay[] = [];
  for (let date = new Date(alignedStart); date <= end; date.setDate(date.getDate() + 1)) {
    const current = new Date(date);
    const key = dateKey(current);
    days.push({
      key,
      date: current,
      count: countsByDay.get(key) || 0
    });
  }

  const weeks: ActivityDay[][] = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  const monthMarkers = weeks
    .map((week, weekIndex) => {
      const monthStart = week.find((day) => day.date.getDate() === 1) || (weekIndex === 0 ? week[0] : null);
      if (!monthStart) {
        return null;
      }
      return { weekIndex, label: monthFormatter.format(monthStart.date) };
    })
    .filter(Boolean) as Array<{ weekIndex: number; label: string }>;

  return { weeks, monthMarkers };
};

export const ActivityHeatmap = ({ activityDates }: ActivityHeatmapProps) => {
  const { weeks, monthMarkers } = useMemo(() => buildHeatmapWeeks(activityDates), [activityDates]);
  const stats = useMemo(() => getActivityStats(activityDates), [activityDates]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/70 bg-white/70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="inline-flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Activity Streaks
            </CardTitle>
            <CardDescription>
              {stats.totalActions.toLocaleString()} submissions in the past year.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="gap-1">
              <Footprints className="h-3.5 w-3.5 text-emerald-500" />
              {stats.activeDays} active days
            </Badge>
            <Badge variant={stats.currentStreak > 0 ? 'success' : 'outline'} className="gap-1">
              <Flame className="h-3.5 w-3.5" />
              {stats.currentStreak} current streak
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3.5 w-3.5 text-warning" />
              {stats.maxStreak} max streak
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 overflow-x-auto pt-4">
        <div className="min-w-[920px]">
          <div className="relative mb-1 h-4 text-[10px] text-muted-foreground">
            {monthMarkers.map((marker) => (
              <span
                key={`${marker.label}-${marker.weekIndex}`}
                className="absolute top-0"
                style={{ left: `${marker.weekIndex * 14}px` }}
              >
                {marker.label}
              </span>
            ))}
          </div>
          <div className="inline-flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="grid gap-1">
                {week.map((day) => (
                  <span
                    key={day.key}
                    className={`h-3.5 w-3.5 rounded-[3px] ${intensityClass(day.count)}`}
                    title={`${day.date.toDateString()} - ${day.count} action${day.count === 1 ? '' : 's'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <p>Last {TOTAL_DAYS} days</p>
          <div className="inline-flex items-center gap-1">
            <span>Less</span>
            <span className="h-3 w-3 rounded-[3px] bg-secondary/35" />
            <span className="h-3 w-3 rounded-[3px] bg-emerald-800/65" />
            <span className="h-3 w-3 rounded-[3px] bg-emerald-600/75" />
            <span className="h-3 w-3 rounded-[3px] bg-emerald-500/90" />
            <span className="h-3 w-3 rounded-[3px] bg-emerald-400" />
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
