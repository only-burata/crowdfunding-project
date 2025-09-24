// src/components/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  showButton = false 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-6 mb-6">
        <i className={`${icon} text-4xl text-blue-600 dark:text-blue-400`}></i>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
      
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      
      {showButton && buttonText && onButtonClick && (
        <button 
          onClick={onButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;