import React, { useState } from 'react';
import { useCampaignManager } from '../hooks/useCampaignManager';
import { useAccount } from 'wagmi';
import {parseEther} from 'viem';

const CampaignCreator: React.FC = () => {
     const [newCampaign, setNewCampaign] = useState({
    name: '',
    goal: '',
    duration: '',
    category: 'technology'
  });

  const { address } = useAccount();
  const { createCampaign } = useCampaignManager();

   const handleCreateCampaign = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!newCampaign.name || !newCampaign.goal || !newCampaign.duration) {
      alert('Please fill all fields');
      return;
    }
//to create campaign
  
 try {
      // Use this format - it's most likely correct for wagmi
      createCampaign?.({
          newCampaign.name,
          parseEther(newCampaign.goal), //Convert to wei
          parseInt(newCampaign.duration) // Convert to number
      });
    // Add this to refresh campaigns
   /* if (typeof refreshCampaigns === 'function') {
      refreshCampaigns();
    }*/
    
    alert(`Campaign "${newCampaign.name}" created successfully!`);
    setNewCampaign({ name: '', goal: '', duration: '', category: 'technology' });
   // setActiveTab('my-campaigns'); // Redirect to my campaigns
    catch (error) {
    console.error('Error creating campaign:', error);
    alert('Failed to create campaign');
  }
};

  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'environment', label: 'Environment' },
    { value: 'art', label: 'Art' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'community', label: 'Community' },
    { value: 'rent', label: 'Rent' },
    { value: 'fund', label: 'Fund' }
  ];

  return (
    <div className = "max-w-2xl mx-auto">
         <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Campaign Title</label>
          <input 
            type="text" 
             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            value={newCampaign.name}
            onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
            placeholder="e.g., NextGen Smartwatch"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Funding Goal (ETH)</label>
          <input  type="number" 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            value={newCampaign.goal}
            onChange={(e) => setNewCampaign({...newCampaign, goal: e.target.value})}
            placeholder="e.g., 50"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Duration (Days)</label>
          <input 
            type="number" 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            value={newCampaign.duration}
            onChange={(e) => setNewCampaign({...newCampaign, duration: e.target.value})}
            placeholder="e.g., 30"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Category</label>
          <select 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            value={newCampaign.category}
            onChange={(e) => setNewCampaign({...newCampaign, category: e.target.value})}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
            </div>

             <button 
          onClick={handleCreateCampaign}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          disabled={!newCampaign.name || !newCampaign.goal || !newCampaign.duration}
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
};
  
export default CampaignCreator;