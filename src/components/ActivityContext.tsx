import React, { createContext, useContext, useState, useEffect} from 'react';
import type {ReactNode} from 'react';
import type { Activity } from '../types';

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'timestamp'>) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem('recentActivities');
    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error('Failed to parse activities from localStorage:', error);
        setActivities([]);
      }
    }
  }, []);

  useEffect(() => {
    // Save activities to localStorage whenever they change
    localStorage.setItem('recentActivities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity: Omit<Activity, 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      timestamp: new Date().toLocaleString(),
    };
    
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  const clearActivities = () => {
    setActivities([]);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};