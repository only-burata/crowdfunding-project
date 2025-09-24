
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { Campaign } from '../types';
import CampaignCard from './CampaignCard';
import CampaignDetails from './CampaignDetails';

const Discover: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  // Since our contract doesn't have getAllCampaigns, we'll use mock data
  // In a real scenario, we'd need to track campaign creation events
  useEffect(() => {
    setIsLoading(true);
    
    // Function To Simulate loading
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories', icon: 'fas fa-globe' },
    { id: 'technology', name: 'Technology', icon: 'fas fa-laptop-code' },
    { id: 'environment', name: 'Environment', icon: 'fas fa-leaf' },
    { id: 'art', name: 'Art', icon: 'fas fa-palette' },
    { id: 'education', name: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'health', name: 'Health', icon: 'fas fa-heartbeat' },
    { id: 'community', name: 'Community', icon: 'fas fa-users' },
    { id: 'rent', name: 'Rent', icon: 'fas fa-home' },
    { id: 'fund', name: 'Fund', icon: 'fas fa-hand-holding-usd' }
  ];

  // Mock campaigns data
  const mockCampaigns: Campaign[] = [
    {
      id: "1",
      title: "NextGen Smartwatch",
      category: "technology",
      goal: "50",
      raised: "42.8",
      backers: 214,
      deadline: Date.now() + 12 * 24 * 60 * 60 * 1000,
      state: 0,
      creator: "0x1234...5678",
      location: "San Francisco, CA"
    },
    {
      id: "2",
      title: "Clean Ocean Initiative",
      category: "environment",
      goal: "30",
      raised: "28.5",
      backers: 512,
      deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
      state: 0,
      creator: "0x1234...5678",
      location: "Global"
    },
    {
      id: "3",
      title: "Tech Education for Kids",
      category: "education",
      goal: "25",
      raised: "18.2",
      backers: 187,
      deadline: Date.now() + 21 * 24 * 60 * 60 * 1000,
      state: 0,
      creator: "0x1234...5678",
      location: "New York, NY"
    },
    {
      id: "4",
       title: "Water system for Community",
      category: "community",
      goal: "5",
      raised: "4",
      backers: 12,
      deadline: Date.now() + 21 * 24 * 60 * 60 * 1000,
      state: 0,
      creator: "0x1234...5678",
      location: "Africa, SA"
     },
     {
      id: 5,
      title: "Art Studio",
      category: "art",
      goal: "7",
      raised: "3",
      backers: 5,
      deadline: Date.now() + 21 * 24 * 60 * 60 * 1000,
      state: 0,
      creator: "0x1234...5678",
      location: "England, Eng"
     },
      {
      id: 6,
      title: "Sick Children UNESCO",
      category: "health",
      goal: "20",
      raised: "10",
      backers: 13,
      deadline: Date.now() + 21 * 24 * 60 * 60 * 1000,
      state: 0,
      creator: "0x1234...5678",
      location: "Global"
     }
  ];

  const filteredCampaigns = activeCategory === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.category.toLowerCase() === activeCategory);

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    //Function To Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

 

return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Discover Projects</h2>
      
      {/* Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-700 dark:text-blue-300">
               {isLoading ? 'Loading campaigns...' : `Found ${campaigns.length} campaign(s)`}
            </p>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
              Browse featured campaigns 
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm flex items-center"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <i className={`${category.icon} text-xl mb-2`}></i>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading campaigns from blockchain...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                onSelect={handleSelectCampaign}
              />
            ))}
          </div>
          
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400">There are no projects in this category yet.</p>
            </div>
          )}
        </>
      )}
      
      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <CampaignDetails 
          campaign={selectedCampaign} 
          onClose={() => setSelectedCampaign(null)} 
        />
      )}
    </div>
  );
};

export default Discover;