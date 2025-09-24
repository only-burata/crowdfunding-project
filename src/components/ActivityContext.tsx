// src/components/ActivityContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';

interface ActivityContextType {
  activities: any[];
  addActivity: (activity: any) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<any[]>([]);

  const addActivity = (activity: any) => {
    setActivities(prev => [...prev, { ...activity, id: Date.now(), timestamp: Date.now() }]);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    // Return a fallback instead of throwing an error
    return {
      activities: [],
      addActivity: () => {} // Empty function as fallback
    };
  }
  return context;
};