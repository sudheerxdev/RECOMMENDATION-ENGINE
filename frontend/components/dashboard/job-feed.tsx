'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Building2, ExternalLink, Loader2, MapPin, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { getStaticOpportunities } from '@/lib/static-opportunities';
import type { Opportunity, RecommendationItem } from '@/lib/types';

interface JobFeedProps {
  recommendations: RecommendationItem[];
  searchQuery?: string;
}

const PAGE_SIZE = 24;

const postedTimeLabel = (postedAt: string) => {
  const postedDate = new Date(postedAt);
  if (Number.isNaN(postedDate.getTime())) {
    return 'Recently posted';
  }

  const millisecondsDiff = Date.now() - postedDate.getTime();
  const dayDiff = Math.max(0, Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24)));
  if (dayDiff === 0) {
    return 'Posted today';
  }
  if (dayDiff === 1) {
    return 'Posted 1 day ago';
  }
  return `Posted ${dayDiff} days ago`;
};

export const JobFeed = ({ recommendations, searchQuery = '' }: JobFeedProps) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [errorNote, setErrorNote] = useState<string | null>(null);

  const preferredRoles = useMemo(() => {
    const unique = new Set<string>();
    recommendations.forEach((item) => {
      item.recommendedJobRoles.forEach((role) => {
        if (unique.size < 10) {
          unique.add(role);
        }
      });
    });
    return Array.from(unique);
  }, [recommendations]);

  const preferredRoleKey = preferredRoles.join('|');

  const loadOpportunities = useCallback(
    async (offset: number, append: boolean) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoadingInitial(true);
      }

      try {
        const result = await apiClient.getOpportunities({
          q: searchQuery || undefined,
          type: 'all',
          roles: preferredRoles,
          limit: PAGE_SIZE,
          offset
        });

        setOpportunities((current) => (append ? [...current, ...result.opportunities] : result.opportunities));
        setTotalCount(result.meta.total);
        setCurrentOffset(offset);
        setIsFallbackMode(Boolean(result.fallbackUsed));
        setErrorNote(result.fallbackUsed ? 'Primary opportunity source unavailable. Showing catalog fallback.' : null);
      } catch (_error) {
        const staticResult = getStaticOpportunities({
          q: searchQuery,
          roles: preferredRoles,
          type: 'all',
          limit: PAGE_SIZE,
          offset
        });

        setOpportunities((current) => (append ? [...current, ...staticResult.items] : staticResult.items));
        setTotalCount(staticResult.total);
        setCurrentOffset(offset);
        setIsFallbackMode(true);
        setErrorNote('Opportunity API is unavailable right now. Showing static offline listings.');
      } finally {
        setIsLoadingInitial(false);
        setIsLoadingMore(false);
      }
    },
    [preferredRoles, searchQuery]
  );

  useEffect(() => {
    loadOpportunities(0, false);
  }, [loadOpportunities, preferredRoleKey, searchQuery]);

  const hasMore = opportunities.length < totalCount;

  return (
    <section id="jobs" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 font-heading text-xl font-semibold">
          <BriefcaseBusiness className="h-5 w-5 text-primary" />
          Jobs & Internships
        </h2>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{totalCount} listings</Badge>
          {isFallbackMode ? <Badge variant="warning">Static fallback mode</Badge> : <Badge variant="success">Live API</Badge>}
        </div>
      </div>

      {errorNote ? (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex items-center gap-2 pt-6 text-sm text-warning">
            <RefreshCw className="h-4 w-4" />
            {errorNote}
          </CardContent>
        </Card>
      ) : null}

      {isLoadingInitial ? (
        <Card>
          <CardContent className="flex items-center gap-2 pt-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Loading opportunities...
          </CardContent>
        </Card>
      ) : null}

      {!isLoadingInitial ? (
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.length ? (
            opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:border-primary/35">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{opportunity.title}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {opportunity.company}
                      </CardDescription>
                    </div>
                    <Badge variant={opportunity.type === 'internship' ? 'warning' : 'success'}>
                      {opportunity.type === 'internship' ? 'Internship' : 'Job'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{opportunity.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline">{opportunity.workMode}</Badge>
                    <Badge variant="outline">{opportunity.experienceLevel}</Badge>
                    <Badge variant="outline">{opportunity.compensation}</Badge>
                  </div>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {opportunity.location}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">{postedTimeLabel(opportunity.postedAt)}</p>
                    <a
                      href={opportunity.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-secondary/45"
                    >
                      Apply
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">No Opportunities Match</CardTitle>
                <CardDescription>
                  No jobs or internships match the current search. Clear search to see more listings.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      ) : null}

      {!isLoadingInitial && hasMore ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadOpportunities(currentOffset + PAGE_SIZE, true)}
            disabled={isLoadingMore}
            className="gap-2"
          >
            {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLoadingMore ? 'Loading more...' : 'Load More Opportunities'}
          </Button>
        </div>
      ) : null}
    </section>
  );
};
