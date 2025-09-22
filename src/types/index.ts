//
export interface Campaign {
    id: number;
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