'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Check, CirclePlus, Trash2, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { CareerGoal } from '@/lib/types';

interface SavedGoalsProps {
  goals: CareerGoal[];
  suggestedSkills: string[];
  onAddGoal: (goal: { title: string; targetDate?: string; linkedSkill?: string }) => void;
  onToggleGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const SavedGoals = ({ goals, suggestedSkills, onAddGoal, onToggleGoal, onDeleteGoal }: SavedGoalsProps) => {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const completedCount = useMemo(() => goals.filter((goal) => Boolean(goal.completedAt)).length, [goals]);

  const submitGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onAddGoal({
      title: trimmedTitle,
      targetDate: targetDate || undefined
    });

    setTitle('');
    setTargetDate('');
  };

  return (
    <Card id="goals" className="overflow-hidden">
      <CardHeader className="border-b border-border/70 bg-white/70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="inline-flex items-center gap-2 text-lg">
              <Trophy className="h-4 w-4 text-primary" />
              Saved Goals
            </CardTitle>
            <CardDescription>Pin your highest-impact outcomes and track completion.</CardDescription>
          </div>
          <Badge variant={completedCount ? 'success' : 'outline'}>
            {completedCount}/{goals.length || 0} completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <form className="grid gap-2 sm:grid-cols-[1fr_180px_auto]" onSubmit={submitGoal}>
          <Input
            value={title}
            placeholder="Ex: Build and ship one recommendation-ready portfolio project"
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
          <Button type="submit" className="gap-2">
            <CirclePlus className="h-4 w-4" />
            Add Goal
          </Button>
        </form>

        {suggestedSkills.length ? (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick goals from skill gaps</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedSkills.slice(0, 6).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="rounded-full border border-border/80 bg-secondary/30 px-2.5 py-1 text-xs font-medium hover:bg-secondary/50"
                  onClick={() =>
                    onAddGoal({
                      title: `Reach working proficiency in ${skill}`,
                      linkedSkill: skill
                    })
                  }
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {goals.length ? (
          <div className="space-y-2">
            {goals.map((goal) => {
              const completed = Boolean(goal.completedAt);
              return (
                <div
                  key={goal.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/75 bg-secondary/20 px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => onToggleGoal(goal.id)}
                    className="inline-flex flex-1 items-center gap-2 text-left"
                  >
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                        completed ? 'border-success bg-success/15 text-success' : 'border-border text-muted-foreground'
                      }`}
                    >
                      {completed ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span>
                      <p className={`text-sm font-medium ${completed ? 'line-through opacity-70' : ''}`}>{goal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {goal.targetDate ? `Target: ${goal.targetDate}` : 'No target date'}
                        {goal.linkedSkill ? ` • Skill: ${goal.linkedSkill}` : ''}
                      </p>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-white/70 hover:text-danger"
                    onClick={() => onDeleteGoal(goal.id)}
                    aria-label="Delete goal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-secondary/20 p-4 text-sm text-muted-foreground">
            No goals saved yet. Add one measurable goal to keep your learning sprint focused.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

