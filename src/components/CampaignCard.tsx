import React from 'react';
import type {Campaign} from '../types';
import type {useState, useEffect} from 'react';

interface CampaignCardProps {
  campaign: Campaign;
  onSelect: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onSelect }) => {
  const formatTimeLeft = (timestamp: number) => {
    const now = Date.now();
    if (timestamp <= now) return "Ended";
    
    const diff = timestamp - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  // Function to get category-specific image
  const getCategoryImage = (category: string) => {
    const categoryImages: Record<string, string> = {
      technology: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      environment: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      art: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      education:  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      health: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      community: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rent: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      fund: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    };
    
    return categoryImages[category.toLowerCase()] || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  };

  // Function to get category color classes
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
    
    return categoryColors[category.toLowerCase()] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300' };
  };

  // Function to generate a default description based on category
  const getDefaultDescription = (category: string, title: string) => {
    const defaultDescriptions: Record<string, string> = {
      technology: `Support ${title} - an innovative technology project that aims to push the boundaries of what's possible.`,
      environment: `Join us in supporting ${title} - an environmental initiative dedicated to making our planet a better place.`,
      art: `Help bring ${title} to life - a creative art project that will inspire and captivate audiences.`,
      education: `Support ${title} - an educational initiative that will empower learners and create new opportunities.`,
      health: `Contribute to ${title} - a health-focused project aimed at improving lives and well-being.`,
      community: `Join our community in supporting ${title} - a project that brings people together for a common cause.`,
      rent: `Help fund ${title} - a project focused on providing housing and rental solutions for those in need.`,
      fund: `Support ${title} - a fundraising initiative that will make a meaningful difference in people's lives.`,
    };
    
    return defaultDescriptions[category.toLowerCase()] || `Support ${title} - an amazing project that needs your backing to succeed.`;
  };

  const categoryColor = getCategoryColor(campaign.category);
  const percentage = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
  const categoryImage = getCategoryImage(campaign.category);

  //to update time
  // In CampaignCard.tsx, add:
//const [timeLeft, setTimeLeft] = useState(formatTimeLeft(campaign.deadline));
  const timeLeft = formatTimeLeft(campaign.deadline);
/*
useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft(formatTimeLeft(campaign.deadline));
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, [campaign.deadline]);
*/
  
  // Use the campaign description if available, otherwise generate a default one
  const description = campaign.description || getDefaultDescription(campaign.category, campaign.title);

  return (
    <div 
      className="campaign-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer"
      onClick={() => onSelect(campaign)}
    >
      {/* Campaign Image */}
      <div className="h-48 relative overflow-hidden">
        <img 
          src={categoryImage} 
          alt={campaign.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
        />
        <div className="absolute top-4 left-4">
          <span className={`${categoryColor.bg} ${categoryColor.text} text-xs font-bold px-3 py-1 rounded-full`}>
            {campaign.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">
          <i className="far fa-clock mr-1"></i> {formatTimeLeft(campaign.deadline)}
        </div>
      </div>
      
      {/* Campaign Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-[#8ca0ad] ">{campaign.title}</h3>
        <p className="text-[#01070a] text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">Raised: {campaign.raised} ETH</span>
            <span className="text-gray-500 dark:text-gray-400">Goal: {campaign.goal} ETH</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full progress-bar" 
              style={{ 
                width: `${percentage}%`,
                backgroundColor: percentage >= 100 ? '#10B981' : '#3B82F6' // Green if funded, blue otherwise
              }}
            ></div>
          </div>
        </div>
        
        {/* Campaign Stats */}
        <div className="flex justify-between text-sm">
        <span className="text-[#8ca0ad]"><i className="fas fa-users mr-1"></i> {campaign.backers} backers</span>
<span className="text-[#8ca0ad]"><i className="fas fa-map-marker-alt mr-1"></i> {campaign.location}</span>
      </div>  
        {/* Action Button */}
        <button className={`w-full ${
          campaign.state === 0 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : campaign.state === 1 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 hover:bg-gray-700'
        } text-white py-2 rounded-lg transition-colors btn-hover`}>
          {campaign.state === 0 ? 'Support Project' : campaign.state === 1 ? 'Funded Successfully' : 'Campaign Ended'}
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;