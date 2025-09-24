// src/components/RecentActivity.tsx
import React from 'react';
import { useActivity } from './ActivityContext';

const RecentActivity: React.FC = () => {
  const { activities } = useActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation': return 'fas fa-donate text-green-500';
      case 'campaign_created': return 'fas fa-rocket text-blue-500';
      case 'campaign_backed': return 'fas fa-hands-helping text-purple-500';
      case 'withdrawal': return 'fas fa-wallet text-orange-500';
      case 'refund': return 'fas fa-undo text-red-500';
      default: return 'fas fa-bell text-gray-500';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'donation': return 'bg-green-100 dark:bg-green-900/30';
      case 'campaign_created': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'campaign_backed': return 'bg-purple-100 dark:bg-purple-900/30';
      case 'withdrawal': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'refund': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // If no activities, show that emptystate
  if (activities.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-200 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-900/50">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <i className="fas fa-bell text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">No activity yet</p>
          <p className="text-gray-800 text-sm mt-2">
            Your donations and campaign activities will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-900/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full">
          {activities.length} activities
        </span>
      </div>
      
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity) => (
          <div 
            key={activity.id} 
            className={`flex items-center p-4 rounded-lg border-l-4 ${
              activity.type === 'donation' ? 'border-l-green-500' :
              activity.type === 'campaign_created' ? 'border-l-blue-500' :
              activity.type === 'campaign_backed' ? 'border-l-purple-500' :
              'border-l-gray-500'
            } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
          >
            <div className={`w-12 h-12 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center mr-4`}>
              <i className={`${getActivityIcon(activity.type)} text-lg`}></i>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{activity.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{activity.description}</p>
                  {activity.transactionHash && (
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${activity.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                    >
                      View on Etherscan
                    </a>
                  )}
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > 10 && (
        <div className="text-center mt-4">
          <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
            View all activities ({activities.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;