// src/components/MyCampaigns.tsx
import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CampaignFactoryABI, CAMPAIGN_FACTORY_ADDRESS } from '../contracts/campaignFactory';
import EmptyState from './EmptyState';

const MyCampaigns: React.FC = () => {
  const { address } = useAccount();

  const { data: userCampaignCount } = useReadContract({
    address: CAMPAIGN_FACTORY_ADDRESS,
    abi: CampaignFactoryABI,
    functionName: 'getUserCampaignCount',
    args: [address],
  });

  const hasCampaigns = userCampaignCount && Number(userCampaignCount) > 0;

  const handleCreateCampaign = () => {
    console.log('Navigate to create campaign page');
  };

  const handleCardClick = (action: string) => {
    console.log(`Card clicked: ${action}`);
    //We can Add cool effects or navigation here
  };

  if (hasCampaigns) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">My Campaigns</h2>
          <p className="text-blue-200">
            You have created {Number(userCampaignCount)} campaign(s)
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-blue-300">Your campaigns will appear here soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">My Campaigns</h2>
        <p className="text-blue-200">Manage and track your created campaigns</p>
      </div>
      
      <EmptyState
        icon="fas fa-rocket"
        title="No campaigns created yet"
        description="Start your journey as a creator! Launch your first campaign and bring your ideas to life with community support."
        buttonText="Create First Campaign"
        onButtonClick={handleCreateCampaign}
        showButton={true}
      />
      
      {/*For Clickable cards with hover effects */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div 
          onClick={() => handleCardClick('community-support')}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 border-2 border-transparent hover:border-blue-300"
        >
          <i className="fas fa-users text-2xl text-blue-600 dark:text-blue-400 mb-3"></i>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Community Support</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">Get backing from people who believe in your vision</p>
        </div>
        
        <div 
          onClick={() => handleCardClick('track-progress')}
          className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-green-100 dark:hover:bg-green-900/30 border-2 border-transparent hover:border-green-300"
        >
          <i className="fas fa-chart-line text-2xl text-green-600 dark:text-green-400 mb-3"></i>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Track Progress</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">Monitor your campaign's funding and backer growth</p>
        </div>
        
        <div 
          onClick={() => handleCardClick('full-control')}
          className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-purple-100 dark:hover:bg-purple-900/30 border-2 border-transparent hover:border-purple-300"
        >
          <i className="fas fa-cog text-2xl text-purple-600 dark:text-purple-400 mb-3"></i>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Full Control</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">Manage and update your campaign as it grows</p>
        </div>
      </div>
    </div>
  );
};

export default MyCampaigns;