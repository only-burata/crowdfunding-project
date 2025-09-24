import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import type { Campaign } from '../types';
import { useActivity } from './ActivityContext';
import campaignABI from '../contracts/abi/CampaignABI.json';

interface CampaignDetailsProps {
  campaign: Campaign;
  onClose: () => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, onClose }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const { address } = useAccount();
  const { addActivity } = useActivity();
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash 
  });

  // Effect for successful donation confirmation
  useEffect(() => {
    if (isConfirmed && hash && donationAmount) {
      //This Updates the activity with transaction hash when confirmed
      addActivity({
        type: 'donation',
        title: 'Donation Confirmed',
        description: `Your donation of ${donationAmount} ETH to "${campaign.title}" was confirmed`,
        amount: donationAmount,
        user: address || '',
        transactionHash: hash,
        campaignTitle: campaign.title,
      });
    }
  }, [isConfirmed, hash, donationAmount, campaign.title, address, addActivity]);

  const handleDonate = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    try {
      writeContract({
        address: campaign.contractAddress as `0x${string}`,
        abi: campaignABI,
        functionName: 'donateFunds',
        value: parseEther(donationAmount),
      });

      //For Adding activity immediately 
      addActivity({
        type: 'donation',
        title: 'Donation Made',
        description: `You donated ${donationAmount} ETH to "${campaign.title}"`,
        amount: donationAmount,
        user: address,
        campaignTitle: campaign.title,
      });

    } catch (error) {
      console.error('Error donating:', error);
      alert('Failed to donate. Check console for details.');
    }
  };

  const percentage = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm px-3 py-1 rounded-full mt-2">
            {campaign.category}
          </span>
        </div>

        {/* Donation Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Support this Project</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Donation Amount (ETH)</label>
            <input 
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.1"
              min="0.001"
              step="0.001"
            />
          </div>

          <button 
            onClick={handleDonate}
            disabled={!donationAmount || isPending || isConfirming}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Donate Now'}
          </button>

          {isPending && (
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-700 dark:text-blue-300">
                ⏳ Confirm the transaction in your wallet...
              </p>
            </div>
          )}

          {isConfirming && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300">
                ⚡ Transaction processing... Waiting for confirmation.
              </p>
            </div>
          )}

          {isConfirmed && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-700 dark:text-green-300">
                ✅ Donation successful! Thank you for your support.
              </p>
              {hash && (
                <a 
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline text-sm mt-2 inline-block"
                >
                  View on Etherscan
                </a>
              )}
            </div>
          )}
        </div>

        {/* Campaign Info */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Progress</h4>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm mt-2 text-gray-600 dark:text-gray-300">
                <span>{campaign.raised} ETH raised</span>
                <span>Goal: {campaign.goal} ETH</span>
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                {percentage.toFixed(1)}% funded
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Campaign Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Backers:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{campaign.backers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Location:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{campaign.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Creator:</span>
                  <span className="font-mono text-xs text-gray-900 dark:text-white truncate max-w-[120px]">
                    {campaign.creator}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Category:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{campaign.category}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About this Campaign</h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Support <strong>{campaign.title}</strong> - an innovative {campaign.category.toLowerCase()} project that aims to make a positive impact. 
              This campaign needs your backing to reach its goal of {campaign.goal} ETH and bring this vision to life.
            </p>
          </div>

          {/* Campaign Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{campaign.raised} ETH</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Raised</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{campaign.backers.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Supporters</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;