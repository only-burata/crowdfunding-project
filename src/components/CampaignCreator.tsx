import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { parseEther } from 'viem';
import { useActivity } from './ActivityContext'
import { CampaignFactoryABI, CAMPAIGN_FACTORY_ADDRESS } from '../contracts/campaignFactory';

const CampaignCreator: React.FC = () => {
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    goal: '',
    duration: '',
    category: 'technology'
  });

  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { writeContract, data: hash } = useWriteContract();
  const { addActivity } = useActivity();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash 
  });


  const handleCreateCampaign = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!newCampaign.name || !newCampaign.goal || !newCampaign.duration) {
      alert('Please fill all fields');
      return;
    }

    try {
      const durationInSeconds = parseInt(newCampaign.duration) * 24 * 60 * 60;
      const deadline = BigInt(Math.floor(Date.now() / 1000) + durationInSeconds);

      writeContract({
        address: CAMPAIGN_FACTORY_ADDRESS,
        abi: CampaignFactoryABI,
        functionName: 'createCampaign',
        args: [
          newCampaign.name,
          parseEther(newCampaign.goal),
          deadline
        ],
      });

    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Check console for details.');
    }
  };

  React.useEffect(() => {
    
    if (isConfirmed) {
    alert(`Campaign "${newCampaign.name}" created successfully!`);
    
    // To Add activity for campaign creation
    addActivity({
      type: 'campaign_created',
      title: 'Campaign Created',
      description: `You launched "${newCampaign.name}" with a goal of ${newCampaign.goal} ETH`,
      user: address || '',
      campaignTitle: newCampaign.name,
    });
    
    setNewCampaign({ name: '', goal: '', duration: '', category: 'technology' });
    queryClient.invalidateQueries({ queryKey: ['readContract'] });
  }
}, [isConfirmed, newCampaign.name, newCampaign.goal, address, addActivity, queryClient]);

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
    <div className="max-w-2xl mx-auto">
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
          <input 
            type="number" 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            value={newCampaign.goal}
            onChange={(e) => setNewCampaign({...newCampaign, goal: e.target.value})}
            placeholder="e.g., 50"
            min="0.01"
            step="0.01"
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
            min="1"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!newCampaign.name || !newCampaign.goal || !newCampaign.duration || isConfirming}
        >
          {isConfirming ? 'Deploying Campaign...' : 'Create Campaign on Blockchain'}
        </button>

        {isConfirming && (
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300">
              ⏳ Transaction pending... Waiting for confirmation.
            </p>
          </div>
        )}

        {isConfirmed && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-700 dark:text-green-300">
              ✅ Campaign created successfully! It will appear in Discover shortly.
            </p>
            <a 
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline text-sm"
            >
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCreator;