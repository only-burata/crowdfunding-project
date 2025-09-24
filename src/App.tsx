import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, mainnet } from '@wagmi/core/chains';
import { injected } from 'wagmi/connectors';
import { useReadContract, useAccount } from 'wagmi';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CampaignCard from './components/CampaignCard';
import CampaignCreator from './components/CampaignCreator';
import CampaignDetails from './components/CampaignDetails';
import Discover from './components/Discover';
import Profile from './components/Profile';
import Settings from './components/Settings';
import StatsCards from './components/StatCards';
import RecentActivity from './components/RecentActivity';
import type { Campaign } from './types';
import { ActivityProvider } from './components/ActivityContext';
import { CampaignFactoryABI, CAMPAIGN_FACTORY_ADDRESS } from './contracts/campaignFactory';
import Bookmarks from './components/BookMarks'; 
import MyCampaigns from './components/MyCampaigns';
import './App.css';

// React Query Client
const queryClient = new QueryClient();

// Wagmi config
const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Error Boundary Component to catch errors
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Component to fetch user's campaigns from blockchain
const DashboardContent: React.FC<{
  setActiveTab: (tab: string) => void;
  setSelectedCampaign: (campaign: Campaign) => void;
}> = ({ setActiveTab, setSelectedCampaign }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  // Get user's campaign count
  const { data: userCampaignCount, refetch: refetchCount, isError } = useReadContract({
    address: CAMPAIGN_FACTORY_ADDRESS,
    abi: CampaignFactoryABI,
    functionName: 'getUserCampaignCount',
    args: [address],
  });

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
      id: "5",
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
      id: "6",
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

  // Load campaigns on component mount
  useEffect(() => {
    setCampaigns(mockCampaigns);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      refetchCount();
      setCampaigns(mockCampaigns);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Welcome Banner - Fixed gradient colors */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-200 rounded-2xl p-8 mb-8 text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">Welcome to <span className="text-blue-100">Blue</span><span className="text-white">Fund</span></h2>
        <p className="text-blue-100 text-lg mb-4">
          {isLoading ? 'Refreshing campaigns...' : `Found ${campaigns.length} campaign(s)`}
        </p>
        {userCampaignCount !== undefined && (
          <p className="text-blue-100 text-sm mb-4">
            You have created {Number(userCampaignCount)} campaign(s) on blockchain
          </p>
        )}
        {isError && (
          <p className="text-red-200 text-sm mb-4">
            Note: Using demo data - blockchain connection limited
          </p>
        )}
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('create')}
            className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            <i className="fas fa-plus-circle mr-2"></i>Create Campaign
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-blue-400 hover:bg-blue-300 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {address && (
          <div className="mt-4 text-blue-100 text-sm">
            <i className="fas fa-wallet mr-2"></i>
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>
      
      <StatsCards />
      
      {/* Campaigns Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Campaigns</h2>
          <button 
            onClick={() => setActiveTab('discover')}
            className="text-blue-300 hover:text-blue-100 font-medium transition-colors duration-200"
          >
            View all <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-blue-200">Refreshing campaigns...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {campaigns.map(campaign => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  onSelect={setSelectedCampaign} 
                />
              ))}
            </div>
            
            {campaigns.length === 0 && (
              <div className="text-center py-12">
                <i className="fas fa-folder-open text-4xl text-blue-300 mb-4"></i>
                <h3 className="text-xl font-medium text-blue-200 mb-2">No campaigns found</h3>
                <p className="text-blue-300">Create your first campaign to get started!</p>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="mt-4 bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Create First Campaign
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <RecentActivity />
    </>
  );
};

const App: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  return (
    <ErrorBoundary>
      <ActivityProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <div className="flex min-h-screen bg-[#2c3e50] text-white transition-colors">
              <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <div className="flex-1 overflow-auto">
                <Header setIsMobileOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} />
                
                <main className="p-6">
                  {activeTab === 'dashboard' && (
                    <DashboardContent 
                      setActiveTab={setActiveTab} 
                      setSelectedCampaign={setSelectedCampaign} 
                    />
                  )}
                  
                  {activeTab === 'discover' && <Discover />}
                  {activeTab === 'create' && <CampaignCreator />}
                  {activeTab === 'profile' && <Profile />}
                  {activeTab === 'settings' && <Settings />}
                  {activeTab === 'my-campaigns' && <MyCampaigns />}
                  {activeTab === 'bookmarks' && <Bookmarks />}
                  
                  {selectedCampaign && (
                    <CampaignDetails 
                      campaign={selectedCampaign} 
                      onClose={() => setSelectedCampaign(null)} 
                    />
                  )}
                </main>
              </div>
            </div>
          </QueryClientProvider>
        </WagmiProvider>
      </ActivityProvider>
    </ErrorBoundary>
  );
};

export default App;