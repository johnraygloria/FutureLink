import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    screening: 0,
    assessment: 0,
    selection: 0,
    engagement: 0,
    total: 0
  });

  const [activities, setActivities] = useState<any[]>([]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/applicants');
      if (response.ok) {
        const data = await response.json();

        const newMetrics = {
          screening: 0,
          assessment: 0,
          selection: 0,
          engagement: 0,
          total: data.length
        };

        // Process Activities (Latest 5 applications)
        const sortedData = [...data].sort((a: any, b: any) => {
          return new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime();
        });

        const recentActivities = sortedData.slice(0, 5).map((app: any, index: number) => {
          const date = new Date(app.date_applied);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const timeAgo = diffDays <= 1 ? '1 day ago' : `${diffDays} days ago`;

          let type = 'application';
          let content = 'submitted application';
          const status = app.status || '';

          if (status.includes('Screening')) {
            type = 'screening';
            content = `is in ${status}`;
          } else if (status.includes('Doc') || status.includes('Requirement')) {
            type = 'document';
            content = `is processing documents: ${status}`;
          } else if (status.includes('Interview')) {
            type = 'interview';
            content = `scheduled for ${status}`;
          } else if (status.includes('Deployed') || status.includes('Boarding')) {
            type = 'success';
            content = `is ${status}`;
          } else if (status) {
            content = `status updated to ${status}`;
          }

          return {
            id: app.id || index,
            user: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Unknown Applicant',
            content: content,
            date: timeAgo,
            type: type
          };
        });

        setActivities(recentActivities);

        data.forEach((app: any) => {
          const status = app.status || '';

          // Screening Phase
          if (['For Screening', 'Doc Screening', 'Physical Screening', 'Initial Interview', 'Document Screening', 'Initial Review', 'Interview Scheduled', 'Interview Completed'].includes(status)) {
            newMetrics.screening++;
          }
          // Assessment Phase
          else if (['For Final Interview/For Assessment', 'Final Interview', 'Final Interview/Incomplete Requirements', 'Final Interview/Complete Requirements'].includes(status)) {
            newMetrics.assessment++;
          }
          // Selection Phase
          else if (['For Completion', 'For Medical', 'For SBMA Gate Pass'].includes(status)) {
            newMetrics.selection++;
          }
          // Engagement Phase
          else if (['For Deployment', 'Deployed', 'On Boarding', 'Metrex'].includes(status)) {
            newMetrics.engagement++;
          }
        });

        setMetrics(newMetrics);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Listen for updates from other components
    const handleUpdate = () => fetchMetrics();
    window.addEventListener('applicant-updated', handleUpdate);
    window.addEventListener('assessment-history-updated', handleUpdate);

    return () => {
      window.removeEventListener('applicant-updated', handleUpdate);
      window.removeEventListener('assessment-history-updated', handleUpdate);
    };
  }, []);

  const stats = [
    {
      id: 1,
      name: 'Screening',
      stat: metrics.screening.toString(),
      icon: UserGroupIcon,
      change: 'Active Pool',
      changeType: 'neutral',
      color: 'info',
    },
    {
      id: 2,
      name: 'Assessment',
      stat: metrics.assessment.toString(),
      icon: DocumentTextIcon,
      change: 'In Progress',
      changeType: 'neutral',
      color: 'warning',
    },
    {
      id: 3,
      name: 'Selection',
      stat: metrics.selection.toString(),
      icon: CheckCircleIcon,
      change: 'Shortlisted',
      changeType: 'increase',
      color: 'primary',
    },
    {
      id: 4,
      name: 'Engagement',
      stat: metrics.engagement.toString(),
      icon: BriefcaseIcon,
      change: 'Deployed/Onboarding',
      changeType: 'increase',
      color: 'success',
    },
  ];

  return (
    <div className="flex w-full relative overflow-hidden h-[calc(100vh-2rem)]">
      <div className="flex-1 max-w-full mx-auto py-6 px-4 md:px-8 h-full">
        <div className="glass-card max-w-full h-full rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl relative z-10 transition-all hover:border-white/20 flex flex-col">

          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <h1 className="text-3xl font-bold text-white tracking-wide">Dashboard</h1>
            <p className="mt-2 text-text-secondary">
              Real-time overview of the recruitment pipeline. Total Applicants: <span className="text-white font-semibold">{metrics.total}</span>
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 shadow-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <dt>
                      <div className={`absolute rounded-xl p-3 ${item.color === 'primary' ? 'bg-primary/20 text-primary-light' :
                        item.color === 'warning' ? 'bg-warning/20 text-warning' :
                          item.color === 'success' ? 'bg-success/20 text-success' :
                            'bg-info/20 text-info'
                        }`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 truncate text-sm font-medium text-text-secondary group-hover:text-white transition-colors">
                        {item.name}
                      </p>
                    </dt>
                    <dd className="ml-16 flex items-baseline">
                      <p className="text-2xl font-bold text-white">{item.stat}</p>
                      <p
                        className={`ml-2 flex items-baseline text-xs font-medium text-text-secondary/70`}
                      >
                        {item.change}
                      </p>
                    </dd>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-white/10">
                <h3 className="text-lg leading-6 font-bold text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== activities.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-white/10"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-[#0f172a]/50 ${activity.type === 'application' ? 'bg-primary/20 text-primary-light' :
                                activity.type === 'screening' ? 'bg-info/20 text-info' :
                                  activity.type === 'document' ? 'bg-warning/20 text-warning' :
                                    'bg-success/20 text-success'
                                }`}>
                                <UserGroupIcon className="h-5 w-5" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-text-secondary">
                                  <span className="font-medium text-white">{activity.user}</span> {activity.content}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-text-secondary/60">
                                <time dateTime={activity.date}>{activity.date}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 