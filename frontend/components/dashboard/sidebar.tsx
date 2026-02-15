'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Compass,
  FileSearch2,
  LayoutDashboard,
  Settings2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'skills', label: 'My Skills', icon: BarChart3 },
  { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
  { id: 'jobs', label: 'Jobs & Internships', icon: BriefcaseBusiness },
  { id: 'learning', label: 'Learning Hub', icon: BookOpenCheck },
  { id: 'resume', label: 'Resume Analyzer', icon: FileSearch2 },
  { id: 'settings', label: 'Settings', icon: Settings2 }
];

interface DashboardSidebarProps {
  userName: string;
}

export const DashboardSidebar = ({ userName }: DashboardSidebarProps) => {
  return (
    <>
      <div className="rounded-2xl border border-border/80 bg-white/85 p-3 shadow-panel backdrop-blur lg:hidden">
        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">Quick Navigation</p>
        <div className="grid grid-cols-2 gap-2">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-secondary/30 px-2 py-2 text-xs font-medium text-foreground/90"
            >
              <item.icon className="h-3.5 w-3.5 text-primary/80" />
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <aside className="hidden h-[calc(100vh-2rem)] rounded-2xl border border-border/80 bg-white/85 p-4 shadow-panel backdrop-blur lg:sticky lg:top-4 lg:block">
        <div className="mb-5 rounded-xl bg-secondary/45 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
          <p className="mt-1 font-heading text-lg font-semibold">{userName || 'Career Explorer'}</p>
          <p className="mt-1 text-xs text-muted-foreground">Career guidance cockpit</p>
        </div>

        <nav className="space-y-1.5">
          {navigationItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className={cn(
                'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:translate-x-0.5 hover:bg-secondary/55 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 text-primary/80 transition-transform group-hover:scale-110" />
              {item.label}
            </motion.a>
          ))}
        </nav>

        <div className="mt-6 rounded-xl border border-border/70 bg-gradient-to-br from-white to-secondary/35 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Compass className="h-4 w-4 text-primary" />
            Weekly Focus
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Complete one recommendation sprint: analyze resume, close one skill gap, and ship one portfolio item.
          </p>
        </div>
      </aside>
    </>
  );
};
