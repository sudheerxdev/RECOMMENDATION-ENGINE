'use client';

import { useEffect, useMemo } from 'react';
import { Award, ImagePlus, Loader2, Mail, Save, UserRound, X } from 'lucide-react';
import { ActivityHeatmap, getActivityStats } from '@/components/dashboard/activity-heatmap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  displayName: string;
  avatarUrl: string;
  skillsInput: string;
  interestsInput: string;
  experienceLevel: 'entry' | 'mid' | 'senior';
  desiredWorkStyle: 'remote' | 'hybrid' | 'onsite' | 'any';
  learningPace: 'casual' | 'balanced' | 'intensive';
  weeklyHours: number;
  targetIndustriesInput: string;
  isSavingProfile: boolean;
  activityDates: string[];
  onDisplayNameChange: (value: string) => void;
  onAvatarUrlChange: (value: string) => void;
  onSkillsChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
  onExperienceChange: (value: 'entry' | 'mid' | 'senior') => void;
  onDesiredWorkStyleChange: (value: 'remote' | 'hybrid' | 'onsite' | 'any') => void;
  onLearningPaceChange: (value: 'casual' | 'balanced' | 'intensive') => void;
  onWeeklyHoursChange: (value: number) => void;
  onTargetIndustriesChange: (value: string) => void;
  onSaveProfile: () => void;
}

export const ProfilePanel = ({
  isOpen,
  onClose,
  userEmail,
  displayName,
  avatarUrl,
  skillsInput,
  interestsInput,
  experienceLevel,
  desiredWorkStyle,
  learningPace,
  weeklyHours,
  targetIndustriesInput,
  isSavingProfile,
  activityDates,
  onDisplayNameChange,
  onAvatarUrlChange,
  onSkillsChange,
  onInterestsChange,
  onExperienceChange,
  onDesiredWorkStyleChange,
  onLearningPaceChange,
  onWeeklyHoursChange,
  onTargetIndustriesChange,
  onSaveProfile
}: ProfilePanelProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activityStats = useMemo(() => getActivityStats(activityDates), [activityDates]);

  if (!isOpen) {
    return null;
  }

  const trimmedName = displayName.trim();
  const avatarFallback = (trimmedName || userEmail || 'U').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Close profile panel"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-border/80 bg-card/95 shadow-2xl backdrop-blur">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/70 bg-card/90 px-4 py-3 backdrop-blur sm:px-5">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Profile</p>
            <h2 className="font-heading text-xl font-semibold">Account and Progress</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={onSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close profile panel">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={trimmedName || 'User'}
                    className="h-14 w-14 rounded-full object-cover ring-1 ring-border"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                    {avatarFallback}
                  </span>
                )}
                <div>
                  <p className="font-semibold">{trimmedName || 'User'}</p>
                  <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {userEmail}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="outline">{skillsInput ? skillsInput.split(',').filter(Boolean).length : 0} skills</Badge>
                    <Badge variant="outline">
                      {interestsInput ? interestsInput.split(',').filter(Boolean).length : 0} interests
                    </Badge>
                    <Badge variant={activityStats.activeDays > 0 ? 'success' : 'outline'} className="gap-1">
                      <Award className="h-3.5 w-3.5" />
                      {activityStats.activeDays} active days
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-name">Display Name</Label>
                  <Input
                    id="profile-name"
                    value={displayName}
                    onChange={(event) => onDisplayNameChange(event.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-avatar">Avatar URL</Label>
                  <div className="relative">
                    <ImagePlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="profile-avatar"
                      value={avatarUrl}
                      onChange={(event) => onAvatarUrlChange(event.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-skills">Skills</Label>
                  <Input
                    id="profile-skills"
                    value={skillsInput}
                    onChange={(event) => onSkillsChange(event.target.value)}
                    placeholder="python, sql, react"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-interests">Interests</Label>
                  <Input
                    id="profile-interests"
                    value={interestsInput}
                    onChange={(event) => onInterestsChange(event.target.value)}
                    placeholder="ai, analytics, product"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-experience">Experience</Label>
                  <Select
                    id="profile-experience"
                    value={experienceLevel}
                    onChange={(event) => onExperienceChange(event.target.value as 'entry' | 'mid' | 'senior')}
                  >
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-work-style">Work Style</Label>
                  <Select
                    id="profile-work-style"
                    value={desiredWorkStyle}
                    onChange={(event) =>
                      onDesiredWorkStyleChange(event.target.value as 'remote' | 'hybrid' | 'onsite' | 'any')
                    }
                  >
                    <option value="any">Any</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-pace">Career Prep Pace</Label>
                  <Select
                    id="profile-pace"
                    value={learningPace}
                    onChange={(event) =>
                      onLearningPaceChange(event.target.value as 'casual' | 'balanced' | 'intensive')
                    }
                  >
                    <option value="casual">Casual</option>
                    <option value="balanced">Balanced</option>
                    <option value="intensive">Intensive</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-hours">Weekly Hours</Label>
                  <Input
                    id="profile-hours"
                    type="number"
                    min={1}
                    max={80}
                    value={weeklyHours}
                    onChange={(event) => onWeeklyHoursChange(Math.min(80, Math.max(1, Number(event.target.value) || 1)))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-industries">Target Industries</Label>
                <Input
                  id="profile-industries"
                  value={targetIndustriesInput}
                  onChange={(event) => onTargetIndustriesChange(event.target.value)}
                  placeholder="fintech, healthtech, ecommerce"
                />
              </div>
            </CardContent>
          </Card>

          <ActivityHeatmap activityDates={activityDates} />

          <div className="rounded-xl border border-border/75 bg-secondary/20 p-3 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-2 font-medium text-foreground">
              <UserRound className="h-4 w-4 text-primary" />
              Profile tip
            </p>
            <p className="mt-1">
              Keep skills and industries up to date so recommendations, courses, and roadmap actions stay relevant.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};
