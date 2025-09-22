import React from 'react';
import { useActivity } from '../components/ActivityContext';


const RecentActivity: React.FC = () => {
  const { activities } = useActivity();
  
    return (
        <div className="recent-activity bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>

            <div className= "space-y-4">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-start">
                    <div
                        className={`w-10 h-10 rounded-full ${
                            activity.iconColor.includes('blue')
                                ? 'bg-blue-100 dark:bg-blue-900/30'
                                : activity.iconColor.includes('green')
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-purple-100 dark:bg-purple-900/30'
                        } flex items-center justify-center text-white font-medium mr-4 ${activity.iconColor}`}
                    >
                        <i className={activity.icon}></i>
                    </div>
                    <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

// Example usage with mock data
// This would be in a parent component