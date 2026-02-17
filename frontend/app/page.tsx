import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  CircleHelp,
  Clock3,
  Code2,
  Handshake,
  MessageCircleQuestion,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditsPopup } from '@/components/home/credits-popup';
import { OpenCreditsButton } from '@/components/home/open-credits-button';
import { CODING_PLATFORMS, LEARNING_CHANNELS } from '@/lib/learning-resources';

const highlights = [
  {
    icon: BadgeCheck,
    title: 'AI Career Matching',
    description: 'Match your profile with role-fit scores and explainable recommendations.'
  },
  {
    icon: Handshake,
    title: 'Live Job Opportunities',
    description: 'Discover jobs and internships aligned to your skills, goals, and preferences.'
  },
  {
    icon: Users,
    title: 'Skill Gap Insights',
    description: 'Identify priority gaps and convert them into actionable weekly targets.'
  },
  {
    icon: Rocket,
    title: 'Recommendation Timeline',
    description: 'Track score movement and compare recommendations across runs.'
  },
  {
    icon: Clock3,
    title: 'Guided Career Paths',
    description: 'Move from target role to roadmap with resources and project direction.'
  }
];

const recognition = [
  {
    title: 'Recommendation Engine',
    description: 'Hybrid ranking using skills, interests, preferences, and history'
  },
  {
    title: 'Job + Internship Feed',
    description: 'Role-aligned listings with resilient fallback catalog'
  },
  {
    title: 'Profile Intelligence',
    description: 'Resume and profile signals converted into actionable next steps'
  },
  {
    title: 'Progress Tracking',
    description: 'Activity streaks, badges, goals, and recommendation history'
  }
];

const faqItems = [
  {
    question: 'What is this platform?',
    answer:
      'It is an AI-assisted career platform for recommendations, skill-gap tracking, roadmap planning, and interview practice.'
  },
  {
    question: 'Can users see features before signup?',
    answer:
      'Yes. The full showcase, outcomes, feature stack, and FAQ are public on the home page before signup.'
  },
  {
    question: 'What do users get after signup?',
    answer:
      'Users unlock dashboard workflows plus a separate career resources page with curated channel and coding-practice suggestions.'
  },
  {
    question: 'How should I use the career resources page?',
    answer:
      'Pick one technology track, subscribe to 3 focused channels, and practice daily on one coding platform for consistency.'
  },
  {
    question: 'Does the platform support interview preparation?',
    answer:
      'Yes. It supports interview-focused recommendations, coding practice platform links, and execution checklists.'
  }
];

const topTechnologiesPreview = Array.from(new Set(LEARNING_CHANNELS.map((channel) => channel.technology))).slice(0, 14);

export default function HomePage() {
  return (
    <main className="page-shell">
      <CreditsPopup />

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-[#0f1729] via-[#111a2d] to-[#132847] text-white">
          <CardContent className="space-y-8 p-6 sm:p-8 lg:p-12">
            <div className="space-y-4">
              <p className="text-center text-sm font-medium text-sky-200">
                Career-focused AI platform for role recommendation and job discovery
              </p>
              <div className="text-center">
                <p className="font-heading text-6xl font-bold tracking-tight text-sky-300 sm:text-7xl lg:text-8xl">
                  75,000+
                </p>
                <p className="mt-2 text-xl text-sky-100">users improving role clarity and job readiness</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-sky-300/15 bg-slate-950/30 p-4 backdrop-blur-sm"
                >
                  <item.icon className="h-5 w-5 text-sky-300" />
                  <p className="mt-3 font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-200/85">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Career Mapping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-sky-300/30 bg-slate-900/25 text-white hover:bg-slate-800/45">
                  Explore Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-1 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Platform Signals</p>
          <h2 className="font-heading text-3xl font-semibold">Built for career and job recommendation workflows</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recognition.map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6">
                <p className="inline-flex items-center gap-2 text-lg font-semibold">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-1 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Why This Platform</p>
          <h2 className="font-heading text-3xl font-semibold">Career outcomes, not generic learning noise</h2>
          <p className="text-muted-foreground">Job fit clarity, structured execution, and role-aligned opportunities.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-sky-500/20 via-blue-500/15 to-cyan-500/20" />
            <CardHeader>
              <CardTitle className="text-lg">Role-Fit Intelligence</CardTitle>
              <CardDescription>Get explainable suitability scores and confidence signals for each path.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20" />
            <CardHeader>
              <CardTitle className="text-lg">Opportunity Discovery</CardTitle>
              <CardDescription>Browse jobs and internships based on recommendations, not random search.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-indigo-500/20 via-blue-500/15 to-sky-500/20" />
            <CardHeader>
              <CardTitle className="text-lg">Execution System</CardTitle>
              <CardDescription>Convert skill gaps to goals, track streaks, and iterate with timeline history.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-border/70 bg-gradient-to-r from-sky-100/40 via-card to-sky-200/35">
          <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Public feature access before signup
              </Badge>
              <h3 className="font-heading text-3xl font-bold tracking-tight">100+ YouTube channels and guided coding practice</h3>
              <p className="text-muted-foreground">
                We prepared a dedicated career resources page for signed-in users where they can choose a
                technology and instantly see curated YouTube channels plus coding platform practice options to support
                their target job path.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {topTechnologiesPreview.map((technology) => (
                  <Badge key={technology} variant="outline">
                    {technology}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/register">
                  <Button className="gap-2">
                    Unlock Career Resources
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline">Already registered? Sign in</Button>
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Directory Scale</p>
                  <p className="mt-1 text-3xl font-bold">{LEARNING_CHANNELS.length}+ channels</p>
                  <p className="mt-1 text-sm text-muted-foreground">Languages, frameworks, mobile, cloud, devops, DSA, and data science.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Practice Platforms</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {CODING_PLATFORMS.slice(0, 6).map((platform) => (
                      <Badge key={platform.id} variant="warning">
                        {platform.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-[#0f1828] via-[#132338] to-[#1a3c63] text-slate-100">
          <CardContent className="grid gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 text-sm text-sky-300">
                <MessageCircleQuestion className="h-4 w-4" />
                Any questions?
              </p>
              <h3 className="font-heading text-3xl font-bold">Talk to a career advisor for a personalized roadmap</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-slate-200/90">
                <li>15-minute personalized role-mapping consultation.</li>
                <li>Job strategy tailored to your background and goals.</li>
                <li>No-cost clarity session before account commitment.</li>
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="w-full gap-2">
                  Request Call Back
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-sky-300/35 bg-slate-900/25 text-white hover:bg-slate-800/45"
                >
                  Login To Continue
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-1 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
          <h2 className="font-heading text-3xl font-semibold">Frequently asked questions</h2>
          <p className="text-muted-foreground">Everything users ask before choosing this career and job recommendation platform.</p>
        </div>
        <Card>
          <CardContent className="space-y-2 pt-6">
            {faqItems.map((item) => (
              <details key={item.question} className="rounded-lg border border-border/75 bg-secondary/15 px-4 py-3">
                <summary className="cursor-pointer list-none text-base font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <CircleHelp className="h-4 w-4 text-primary" />
                    {item.question}
                  </span>
                </summary>
                <p className="mt-2 pl-6 text-sm text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/70 bg-card/55">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="font-heading text-lg font-semibold">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Career Recommendation Engine</li>
              <li>Job & Internship Discovery</li>
              <li>Skill Gap to Goal Planner</li>
              <li>Career Resources Hub</li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Success Stories</li>
              <li>Hiring Partners</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">Resources</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Cookie Settings</li>
              <li>Refund Policy</li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">Connect</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <School className="h-3.5 w-3.5" />
                AI Role Matching
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Job Feed Ready
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Target className="h-3.5 w-3.5" />
                Career-Focused
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Code2 className="h-3.5 w-3.5" />
                Resume + Profile Signals
              </Badge>
              <Badge variant="outline" className="gap-1">
                <BookOpenCheck className="h-3.5 w-3.5" />
                Resources + Execution
              </Badge>
            </div>
            <div className="mt-4">
              <OpenCreditsButton buttonProps={{ variant: 'outline', size: 'sm' }} />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
