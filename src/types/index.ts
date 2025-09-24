//
export interface Campaign {
    id: number | string;
    title: string;
    goal: string;
    raised: string;
    deadline: number;
    backers: number;
    state: number;
    creator: string;
    category: string;
    location: string;
    description?: string;
    contractAddress?: string;
}

export interface CampaignCreation {
  name: string;
  goal: string;
  duration: string;
  category: string;
}

export interface Activity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  iconColor: string;
}

export interface blockchainCampaignData {
  campaignId: string;
  totalAmount: number;
  totalDonors: number;
  status: 'active' | 'completed' | 'cancelled';
  contractAddress: string;
  owner: string;
  deadline: number;
  targetAmount: number;
  currentBalance: number;
}