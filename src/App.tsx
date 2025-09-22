import React, { useState } from 'react';
import { QueryClient, QueryClientProvider,} from '@tanstack/react-query';
import {WagmiProvider, createConfig, http } from 'wagmi';
import {sepolia, mainnet} from '@wagmi/core/chains';
import { injected } from 'wagmi/connectors';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CampaignCard from './components/CampaignCard';
import CampaignCreator from './components/CampaignCreator';
import CampaignDetails from './components/CampaignDetails';
import Discover from './components/Discover'; // Add this import
import Profile from './components/Profile'; // Add this import
import Settings from './components/Settings'; // Add this import
import StatsCards from './components/StatCards';
import RecentActivity from './components/RecentActivity';
import type { Campaign } from './types';
import { ActivityProvider } from './components/ActivityContext'; // Add this import
import './App.css';

//React Query Client created
const queryClient = new QueryClient();

// for mobile menu
const [isMobileOpen, setIsMobileOpen] = useState(false);

// Set up Wagmi config with proper types
const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
     [sepolia.id]: http(),
  },
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Mock data for campaigns
  React.useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: 1,
        title: "NextGen Smartwatch",
        goal: "50000",
        raised: "42800",
        deadline: Date.now() + 12 * 24 * 60 * 60 * 1000,
        backers: 214,
        state: 0,
        creator: "0x1234...5678",
        category: "Technology",
        location: "San Francisco, CA"
      },
      {
        id: 2,
        title: "Clean Ocean Initiative",
        goal: "30000",
        raised: "28500",
        deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
        backers: 512,
        state: 0,
        creator: "0x1234...5678",
        category: "Environment",
        location: "Global"
      },
      {
        id: 3,
        title: "Tech Education for Kids",
        goal: "25000",
        raised: "18200",
        deadline: Date.now() + 21 * 24 * 60 * 60 * 1000,
        backers: 187,
        state: 0,
        creator: "0x1234...5678",
        category: "Education",
        location: "New York, NY"
      },
       {
        id: 4,
        title: "Claret's Lodge rent",
        goal: "25000",
        raised: "18200",
        deadline: Date.now() + 21 * 24 * 60 * 60 * 1000,
        backers: 187,
        state: 0,
        creator: "0x31696FB200d382E3b557bD4AD8d33069c0AE590D",
        category: "Rent",
        location: "Lagos, Nigeria",
      }
    ];
    setCampaigns(mockCampaigns);
  }, []);

  return (
    <ActivityProvider>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Header setIsMobileOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} />
       <div className="flex min-h-screen bg-[#2c3e50] text-white transition-colors">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="flex-1 overflow-auto">
            <Header />
            
            <main className="p-6">
              {activeTab === 'dashboard' && (
                <>
                  {/* Welcome Banner */}
                  <div className="bg-[#d3e2f1] dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 text-white mb-8">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Blue<span className="text-blue-600 dark:text-blue-400">Fund</span></h2>
                    <p className="mb-4 text-gray-400 font-bold">Discover and support innovative projects, or start your own campaign today.</p>
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="bg-[#286d97] hover:bg-[#2980b9] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                      Create Campaign
                    </button>
                  </div>
                  
                  <StatsCards />
                  
       {/* Campaigns Section */}
    <div className="bg-[#d3e2f1] dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Featured Campaigns</h2>
        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          View all <i className="fas fa-arrow-right ml-1"></i>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {campaigns.map(campaign => (
          <CampaignCard 
            key={campaign.id} 
            campaign={campaign} 
            onSelect={setSelectedCampaign} 
          />
        ))}
      </div>
    </div>
    
    <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6"></div>
                  
                  <RecentActivity />
                </>
              )}
              
              {activeTab === 'discover' && <Discover />}
              {activeTab === 'create' && <CampaignCreator />}
              {activeTab === 'profile' && <Profile />}
              {activeTab === 'settings' && <Settings />}
              
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
  );
};


export default App;