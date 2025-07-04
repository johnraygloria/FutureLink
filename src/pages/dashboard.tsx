import React from 'react';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const stats = [
    {
      id: 1,
      name: 'Total Applicants',
      stat: '1,234',
      icon: UserGroupIcon,
      change: '+12%',
      changeType: 'increase',
    },
    {
      id: 2,
      name: 'Pending Reviews',
      stat: '89',
      icon: ClockIcon,
      change: '+5%',
      changeType: 'increase',
    },
    {
      id: 3,
      name: 'Approved',
      stat: '567',
      icon: CheckCircleIcon,
      change: '+18%',
      changeType: 'increase',
    },
    {
      id: 4,
      name: 'Documents',
      stat: '2,456',
      icon: DocumentTextIcon,
      change: '+8%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your applicant management system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
            >
              <dt>
                <div className="absolute rounded-md bg-blue-500 p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
          <div className="mt-5">
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  {
                    id: 1,
                    content: 'New applicant John Ray Gloria submitted application',
                    date: '2 hours ago',
                    type: 'application',
                  },
                  {
                    id: 2,
                    content: 'John Neo Lopez completed screening process',
                    date: '4 hours ago',
                    type: 'screening',
                  },
                  {
                    id: 3,
                    content: 'Robles Dominique uploaded required documents',
                    date: '6 hours ago',
                    type: 'document',
                  },
                  {
                    id: 4,
                    content: 'Rey John Ebe scheduled interview',
                    date: '1 day ago',
                    type: 'interview',
                  },
                ].map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== 3 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <UserGroupIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.content}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
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
  );
} 