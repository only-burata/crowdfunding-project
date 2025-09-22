import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Campaign } from '../types';
import { useActivity } from '../components/ActivityContext';

interface CampaignDetailsProps {
  campaign: Campaign;
  onClose: () => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, onClose }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const { isConnected } = useAccount();
  const { addActivity } = useActivity();

  // Function to get category-specific image (same as in CampaignCard)
  const getCategoryImage = (category: string) => {
    const categoryImages: Record<string, string> = {
      technology: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      environment: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      art: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      education:  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      health: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      community: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rent: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      fund: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    };
    
    return categoryImages[category.toLowerCase()] || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  };

  // Function to get category color classes (same as in CampaignCard)
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, { bg: string, text: string }> = {
      technology: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
      environment: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
      art: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
      education: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
      health: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
      community: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
      rent: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300' },
      fund: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300' },
    };
    
    return categoryColors[category.toLowerCase()] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-700' };
  };

  const formatTimeLeft = (timestamp: number) => {
    const now = Date.now();
    if (timestamp <= now) return "Ended";
    
    const diff = timestamp - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  const categoryColor = getCategoryColor(campaign.category);
  const percentage = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
  const categoryImage = getCategoryImage(campaign.category);

  const handleDonate = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    // In a real app, this would interact with your smart contract
    console.log(`Donating ${donationAmount} ETH to campaign`);
    
    // Add to recent activity
    addActivity ({
      type: "donation",
      title: "New donation received",
      description: `You donated ${donationAmount} ETH to ${campaign.title}`,
      icon: "fas fa-donate",
      iconColor: "text-blue-600 dark:text-blue-300"
    });

    // When creating a campaign or donating, add activity:
   addActivity({
  type: "campaign_created",
  title: "Campaign Created",
  description: `You created "${campaign}" campaign`,
  icon: "fas fa-plus",
  iconColor: "text-green-400"
});
    
    // Update recent activities (you would store this in state/context)
    const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    const updatedActivities = [addActivity, ...existingActivities.slice(0, 9)]; // Keep only 10 most recent
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities));
    
    //Thank you for ypour donation amount alert
     const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-gift text-xl mr-3"></i>
      <div>
        <p class="font-bold">Thank you for your support! 🎉</p>
        <p>Your donation of ${donationAmount} ETH will help make this project a reality!</p>
      </div>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
  
  setDonationAmount('');
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{campaign.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-700 dark:hover:text-gray-700">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          {/* Campaign Image - FIXED */}
          <div className="h-64 relative overflow-hidden rounded-xl mb-6">
            <img 
              src={categoryImage} 
              alt={campaign.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-4 left-4">
              <span className={`${categoryColor.bg} ${categoryColor.text} text-xs font-bold px-3 py-1 rounded-full`}>
                {campaign.category}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-700 text-xs font-medium px-2 py-1 rounded">
              <i className="far fa-clock mr-1"></i> {formatTimeLeft(campaign.deadline)}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-500">Raised: {campaign.raised} ETH</span>
              <span className="text-gray-500 dark:text-gray-500">Goal: {campaign.goal} ETH</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full progress-bar" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: percentage >= 100 ? '#10B981' : '#3B82F6'
                }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg`}>
              <p className={`text-sm text-blue-600 dark:text-blue-300`}>Backers</p>
              <p className="text-xl font-bold text-gray-500">{campaign.backers}</p>
            </div>
            <div className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg`}>
              <p className={`text-sm text-blue-600 dark:text-blue-300`}>Time Left</p>
              <p className="text-xl font-bold  text-gray-500">{formatTimeLeft(campaign.deadline)}</p>
            </div>
            <div className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg`}>
              <p className={`text-sm text-blue-600 dark:text-blue-300`}>Creator</p>
              <p className="text-xl font-bold truncate  text-gray-500">{campaign.creator}</p>
            </div>
            <div className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg`}>
              <p className={`text-sm text-blue-600 dark:text-blue-300`}>Location</p>
              <p className="text-xl font-bold  text-gray-500">{campaign.location}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-800">
              {campaign.description || "This campaign aims to make a positive impact. Support this project to help bring it to life."}
            </p>
          </div>
          
          {isConnected && campaign.state === 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-medium mb-2">Support this Campaign</h3>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Amount in ETH"
                  min="0.001"
                  step="0.001"
                />
                <button 
                  onClick={handleDonate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Donate
                </button>
              </div>
            </div>
          )}
          
          {!isConnected && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-center text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to support this campaign</p>
              <button 
                onClick={() => {/* Connect wallet logic would go here */}}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;