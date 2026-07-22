import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import PipelinePageShell from '../components/Pipeline/PipelinePageShell';
import PipelineModuleHeader from '../components/Pipeline/PipelineModuleHeader';
import { useDebouncedCallback } from '../lib/useDebouncedCallback';
import { useNavigation, type SectionKey } from '../Global/NavigationContext';

type ActivityType = 'application' | 'screening' | 'document' | 'interview' | 'success' | 'update';

interface ActivityItem {
  id: string | number;
  user: string;
  content: string;
  timeLabel: string;
  isoDate: string;
  type: ActivityType;
  status: string;
}

function parseActivityDate(app: Record<string, unknown>): Date | null {
  const raw = app.updated_at || app.created_at || app.date_applied;
  if (!raw || typeof raw !== 'string') return null;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function formatTimeAgo(date: Date): { label: string; iso: string } {
  const now = Date.now();
  const then = date.getTime();
  const diffMs = now - then;

  if (diffMs < 0) {
    return {
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      iso: date.toISOString(),
    };
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  let label: string;
  if (diffSec < 45) label = 'Just now';
  else if (diffMin < 60) label = `${diffMin} min ago`;
  else if (diffHour < 24) label = diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  else if (diffDay === 1) label = 'Yesterday';
  else if (diffDay < 7) label = `${diffDay} days ago`;
  else if (diffDay < 30) label = `${Math.floor(diffDay / 7)} wk ago`;
  else {
    label = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  }

  return { label, iso: date.toISOString() };
}

function buildActivityContent(status: string): { content: string; type: ActivityType } {
  if (!status) return { content: 'submitted an application', type: 'application' };
  if (status.includes('Screening')) return { content: `is in ${status}`, type: 'screening' };
  if (status.includes('Doc') || status.includes('Requirement')) {
    return { content: `is processing documents: ${status}`, type: 'document' };
  }
  if (status.includes('Interview')) return { content: `scheduled for ${status}`, type: 'interview' };
  if (status.includes('Deployed') || status.includes('Boarding')) {
    return { content: `is ${status}`, type: 'success' };
  }
  return { content: `status updated to ${status}`, type: 'update' };
}

const activityStyles: Record<ActivityType, string> = {
  application: 'bg-primary/15 text-primary-light border-primary/25',
  screening: 'bg-info/15 text-info border-info/25',
  document: 'bg-warning/15 text-warning border-warning/25',
  interview: 'bg-primary/20 text-primary-light border-primary/30',
  success: 'bg-success/15 text-success border-success/25',
  update: 'bg-white/10 text-white/80 border-white/15',
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    screening: 0,
    assessment: 0,
    selection: 0,
    engagement: 0,
    total: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setActiveSection } = useNavigation();

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/applicants');
      if (!response.ok) return;

      const data = await response.json();
      const newMetrics = {
        screening: 0,
        assessment: 0,
        selection: 0,
        engagement: 0,
        total: data.length,
      };

      const sortedData = [...data].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        const dateA = parseActivityDate(a)?.getTime() ?? 0;
        const dateB = parseActivityDate(b)?.getTime() ?? 0;
        return dateB - dateA;
      });

      const recentActivities: ActivityItem[] = sortedData.slice(0, 8).flatMap((app: Record<string, unknown>, index: number) => {
        const activityDate = parseActivityDate(app);
        if (!activityDate) return [];

        const { label, iso } = formatTimeAgo(activityDate);
        const status = String(app.status || '');
        const { content, type } = buildActivityContent(status);
        const firstName = String(app.first_name || '');
        const lastName = String(app.last_name || '');

        return [{
          id: (app.id ?? app.applicant_no ?? index) as string | number,
          user: `${firstName} ${lastName}`.trim() || String(app.fb_name || 'Unknown Applicant'),
          content,
          timeLabel: label,
          isoDate: iso,
          type,
          status,
        }];
      });

      setActivities(recentActivities);

      data.forEach((app: Record<string, unknown>) => {
        const status = String(app.status || '');

        if (['For Screening', 'Doc Screening', 'Physical Screening', 'Initial Interview', 'Document Screening', 'Initial Review', 'Interview Scheduled', 'Interview Completed'].includes(status)) {
          newMetrics.screening++;
        } else if (['Final Interview', 'Final Interview/Incomplete Requirements', 'Final Interview/Complete Requirements', 'For Completion'].includes(status)) {
          newMetrics.assessment++;
        } else if (['For Medical', 'Pending For Medical', 'For SBMA Gate Pass', 'Biometrics'].includes(status)) {
          newMetrics.selection++;
        } else if (['For Onboarding', 'For Deployment', 'Deployed', 'On Boarding', 'Metrex'].includes(status)) {
          newMetrics.engagement++;
        }
      });

      setMetrics(newMetrics);
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Each event triggers a full /api/applicants pull; during bulk operations
  // that fires hundreds of times, so coalesce into one refetch per burst.
  const debouncedFetchMetrics = useDebouncedCallback(fetchMetrics, 400);

  useEffect(() => {
    fetchMetrics();

    window.addEventListener('applicant-updated', debouncedFetchMetrics);
    window.addEventListener('assessment-history-updated', debouncedFetchMetrics);

    return () => {
      window.removeEventListener('applicant-updated', debouncedFetchMetrics);
      window.removeEventListener('assessment-history-updated', debouncedFetchMetrics);
    };
  }, [debouncedFetchMetrics]);

  const stats = [
    { id: 1, name: 'Screening', stat: metrics.screening, icon: UserGroupIcon, hint: 'Active pool', color: 'info' as const },
    { id: 2, name: 'Assessment', stat: metrics.assessment, icon: DocumentTextIcon, hint: 'In progress', color: 'warning' as const },
    { id: 3, name: 'Selection', stat: metrics.selection, icon: CheckCircleIcon, hint: 'Shortlisted', color: 'primary' as const },
    { id: 4, name: 'Engagement', stat: metrics.engagement, icon: BriefcaseIcon, hint: 'Deployed / onboarding', color: 'success' as const },
  ];

  const statAccent: Record<string, string> = {
    info: 'border-info/20 bg-info/10',
    warning: 'border-warning/20 bg-warning/10',
    primary: 'border-primary/20 bg-primary/10',
    success: 'border-success/20 bg-success/10',
  };

  const statIconAccent: Record<string, string> = {
    info: 'bg-info/20 text-info',
    warning: 'bg-warning/20 text-warning',
    primary: 'bg-primary/20 text-primary-light',
    success: 'bg-success/20 text-success',
  };

  return (
    <PipelinePageShell fullHeight className="flex flex-col">
      <PipelineModuleHeader
        title="Dashboard"
        subtitle="Real-time overview of applicants across every stage of the recruitment pipeline."
        count={metrics.total}
        icon="fa-chart-line"
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            const section = item.name.toLowerCase() as SectionKey;
            const goToSection = () => setActiveSection(section);
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={goToSection}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSection();
                  }
                }}
                title={`View ${item.name}`}
                className={`cursor-pointer rounded-2xl border p-5 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${statAccent[item.color]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary/80">{item.name}</p>
                    <p className="mt-2 text-3xl font-black text-white">{item.stat}</p>
                    <p className="mt-1 text-xs text-text-secondary/70">{item.hint}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${statIconAccent[item.color]}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1219]/85 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Recent Activity</h3>
              <p className="text-xs text-text-secondary/70 mt-0.5">Latest applicant updates across the system</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/30 text-white/70 border border-white/10">
              <ClockIcon className="h-3.5 w-3.5" />
              Live
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="py-10 text-center text-sm text-text-secondary animate-pulse">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-white/20" />
                </div>
                <p className="text-sm text-text-secondary">No recent activity yet</p>
              </div>
            ) : (
              <ul className="space-y-0">
                {activities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className={`relative ${activityIdx !== activities.length - 1 ? 'pb-6' : ''}`}>
                      {activityIdx !== activities.length - 1 && (
                        <span className="absolute top-5 left-4 -ml-px h-[calc(100%-0.5rem)] w-px bg-white/10" aria-hidden="true" />
                      )}
                      <div className="relative flex gap-4">
                        <span className={`h-8 w-8 shrink-0 rounded-xl border flex items-center justify-center ${activityStyles[activity.type]}`}>
                          <UserGroupIcon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pt-0.5">
                          <div className="min-w-0">
                            <p className="text-sm text-text-secondary leading-relaxed">
                              <span className="font-semibold text-white">{activity.user}</span>{' '}
                              {activity.content}
                            </p>
                            {activity.status && (
                              <span className="inline-flex mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-black/25 text-white/60 border border-white/10">
                                {activity.status}
                              </span>
                            )}
                          </div>
                          <time
                            dateTime={activity.isoDate}
                            title={new Date(activity.isoDate).toLocaleString()}
                            className="shrink-0 text-xs font-medium text-text-secondary/70 sm:text-right whitespace-nowrap"
                          >
                            {activity.timeLabel}
                          </time>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PipelinePageShell>
  );
}
