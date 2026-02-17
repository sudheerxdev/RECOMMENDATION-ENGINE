'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpenCheck,
  ExternalLink,
  Filter,
  GraduationCap,
  ListChecks,
  Loader2,
  Search,
  Youtube
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { authStorage } from '@/lib/auth';
import { CODING_PLATFORMS, LEARNING_CHANNELS } from '@/lib/learning-resources';

const CHANNEL_PAGE_SIZE = 24;

export default function LearningRecommendationsPage() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(CHANNEL_PAGE_SIZE);
  const [selectedPlatformId, setSelectedPlatformId] = useState(CODING_PLATFORMS[0].id);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    setIsAuthChecking(false);
  }, [router]);

  useEffect(() => {
    setVisibleCount(CHANNEL_PAGE_SIZE);
  }, [searchQuery, selectedTechnology, selectedCategory]);

  const technologies = useMemo(
    () => Array.from(new Set(LEARNING_CHANNELS.map((channel) => channel.technology))).sort((left, right) => left.localeCompare(right)),
    []
  );

  const categories = useMemo(
    () => Array.from(new Set(LEARNING_CHANNELS.map((channel) => channel.category))).sort((left, right) => left.localeCompare(right)),
    []
  );

  const filteredChannels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return LEARNING_CHANNELS.filter((channel) => {
      if (selectedTechnology !== 'all' && channel.technology !== selectedTechnology) {
        return false;
      }

      if (selectedCategory !== 'all' && channel.category !== selectedCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [channel.name, channel.technology, channel.category, channel.focus].join(' ').toLowerCase();
      return searchable.includes(query);
    });
  }, [searchQuery, selectedTechnology, selectedCategory]);

  const visibleChannels = filteredChannels.slice(0, visibleCount);
  const hasMoreChannels = filteredChannels.length > visibleChannels.length;
  const selectedPlatform = CODING_PLATFORMS.find((platform) => platform.id === selectedPlatformId) || CODING_PLATFORMS[0];

  if (isAuthChecking) {
    return (
      <main className="page-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Card>
            <CardContent className="flex items-center gap-2 pt-6">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verifying account access...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <Card className="overflow-hidden">
          <CardContent className="space-y-5 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-white/70 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary/45 hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Dashboard
                </Link>
                <h1 className="font-heading text-3xl font-bold tracking-tight">Career Resources</h1>
                <p className="max-w-3xl text-sm text-muted-foreground">
                  Select a technology to see curated creator channels and career-focused practice resources. Then pick one
                  coding platform for daily interview-oriented problem solving.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="success">{LEARNING_CHANNELS.length}+ channels</Badge>
                <Badge variant="outline">{technologies.length} technologies</Badge>
                <Badge variant="outline">{CODING_PLATFORMS.length} coding platforms</Badge>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Total Channels</p>
                  <p className="mt-1 text-2xl font-bold">{LEARNING_CHANNELS.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Matched Channels</p>
                  <p className="mt-1 text-2xl font-bold">{filteredChannels.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Categories</p>
                  <p className="mt-1 text-2xl font-bold">{categories.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Practice Platforms</p>
                  <p className="mt-1 text-2xl font-bold">{CODING_PLATFORMS.length}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card id="channel-directory">
          <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg">
                <Youtube className="h-4 w-4 text-danger" />
              YouTube Career Directory
              </CardTitle>
            <CardDescription>Filter by technology and subscribe to high-signal career growth channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-1.5 xl:col-span-2">
                <Label htmlFor="channel-search">Search channels</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="channel-search"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by channel, technology, or focus..."
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="technology-filter">Technology</Label>
                <Select
                  id="technology-filter"
                  value={selectedTechnology}
                  onChange={(event) => setSelectedTechnology(event.target.value)}
                >
                  <option value="all">All technologies</option>
                  {technologies.map((technology) => (
                    <option key={technology} value={technology}>
                      {technology}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category-filter">Category</Label>
                <Select id="category-filter" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleChannels.map((channel) => (
                <Card key={channel.id} className="hover:border-primary/35">
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{channel.name}</p>
                        <p className="text-xs text-muted-foreground">{channel.focus}</p>
                      </div>
                      <Badge variant="outline">{channel.category}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="warning">{channel.technology}</Badge>
                    </div>

                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium hover:bg-secondary/45"
                    >
                      Subscribe / Open
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!visibleChannels.length ? (
              <Card className="border-border/80 bg-secondary/20">
                <CardContent className="pt-6 text-sm text-muted-foreground">
                  No channels match current filters. Try another technology or clear search.
                </CardContent>
              </Card>
            ) : null}

            {hasMoreChannels ? (
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setVisibleCount((current) => current + CHANNEL_PAGE_SIZE)}>
                  Load More Channels
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card id="practice-platforms">
            <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-lg">
                <GraduationCap className="h-4 w-4 text-primary" />
                Daily Career Practice Platforms
              </CardTitle>
              <CardDescription>Choose one platform and stay consistent for job interview readiness.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {CODING_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatformId === platform.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSelectedPlatformId(platform.id)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                      isSelected
                        ? 'border-primary/60 bg-primary/5'
                        : 'border-border/70 bg-secondary/20 hover:bg-secondary/35'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{platform.name}</p>
                      <Badge variant={isSelected ? 'success' : 'outline'}>{platform.bestFor}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{platform.description}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-lg">
                <ListChecks className="h-4 w-4 text-success" />
                Selected Practice Plan
              </CardTitle>
              <CardDescription>Focus on one platform, one technology, one weekly target.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
                <p className="font-semibold">{selectedPlatform.name}</p>
                <p className="mt-1 text-muted-foreground">{selectedPlatform.description}</p>
                <a
                  href={selectedPlatform.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-secondary/45"
                >
                  Start Practicing
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="rounded-lg border border-border/70 bg-secondary/25 p-3">
                <p className="font-semibold">7-day sprint template</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>Day 1-2: 3 easy problems + 1 concept recap video.</li>
                  <li>Day 3-4: 2 medium problems and revision notes.</li>
                  <li>Day 5: Mock interview question set.</li>
                  <li>Day 6: Re-solve weak questions without hints.</li>
                  <li>Day 7: Track improvement and set next-week goals.</li>
                </ul>
              </div>

              <div className="rounded-lg border border-success/35 bg-success/10 p-3">
                <p className="inline-flex items-center gap-1 font-semibold text-success">
                  <BookOpenCheck className="h-4 w-4" />
                  Consistency rule
                </p>
                <p className="mt-1 text-muted-foreground">
                  Subscribe to 3 channels max per technology and practice at least one coding platform daily for best results.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
