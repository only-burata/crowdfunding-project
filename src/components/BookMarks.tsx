// src/components/Bookmarks.tsx
import React from 'react';
import EmptyState from './EmptyState';

const Bookmarks: React.FC = () => {
  const handleDiscoverProjects = () => {
    console.log('Navigate to discover page');
  };

  const handleCardClick = (action: string) => {
    console.log(`Card clicked: ${action}`);
   
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Bookmarks</h2>
        <p className="text-blue-200">Your saved favorite projects</p>
      </div>
      
      <EmptyState
        icon="fas fa-bookmark"
        title="No bookmarks yet"
        description="When you find projects you love, bookmark them to easily find them later. Your saved campaigns will appear here."
        buttonText="Discover Projects"
        onButtonClick={handleDiscoverProjects}
        showButton={true}
      />
      
      {/* Clickable cards with the hover effects */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div 
          onClick={() => handleCardClick('save-favorites')}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 border-2 border-transparent hover:border-blue-300"
        >
          <i className="fas fa-heart text-2xl text-blue-600 dark:text-blue-400 mb-3"></i>
          <h4 className="font-semibold text-gray-900 mb-2">Save Favorites</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">Bookmark campaigns you want to support later</p>
        </div>
        
        <div 
          onClick={() => handleCardClick('track-progress')}
          className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-green-100 dark:hover:bg-green-900/30 border-2 border-transparent hover:border-green-300"
        >
          <i className="fas fa-bell text-2xl text-green-600 dark:text-green-400 mb-3"></i>
          <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">Monitor your favorite projects' funding progress</p>
        </div>
        
        <div 
          onClick={() => handleCardClick('quick-access')}
          className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-purple-100 dark:hover:bg-purple-900/30 border-2 border-transparent hover:border-purple-300"
        >
          <i className="fas fa-rocket text-2xl text-purple-600 dark:text-purple-400 mb-3"></i>
          <h4 className="font-semibold text-gray-900  mb-2">Quick Access</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">Easily return to campaigns you're interested in</p>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;