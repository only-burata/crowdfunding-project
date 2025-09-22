import React, { useState } from 'react';
import { useAccount } from 'wagmi';

const Profile: React.FC = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Claret Kanyima',
    username: 'Claretto',
    email: 'Claret.k@example.com',
    bio: 'Blockchain enthusiast and Frontend Developer',
    website: 'https://claret.com',
    twitter: '@0xClaret_dev',
    profileImage: null as string | null
  });

  const [editData, setEditData] = useState({ ...userData });

  const stats = [
    { label: 'Campaigns Created', value: '12' },
    { label: 'Campaigns Backed', value: '24' },
    { label: 'Total Contributed', value: '4.5 ETH' },
    { label: 'Success Rate', value: '83%' }
  ];

  const recentActivities = [
    { action: 'Backed', project: 'Clean Ocean Initiative', amount: '0.5 ETH', time: '2 hours ago' },
    { action: 'Created', project: 'Tech Education for Kids', amount: '', time: '1 day ago' },
    { action: 'Backed', project: 'NextGen Smartwatch', amount: '1.2 ETH', time: '3 days ago' },
    { action: 'Withdrew', project: 'Community Garden', amount: '2.0 ETH', time: '1 week ago' }
  ];

   const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  // Mock campaigns data
  const userCampaigns = [
    {
      id: 1,
      title: "Tech Education for Kids",
      category: "Education",
      goal: "25",
      raised: "18",
      backers: 56,
      daysLeft: 12,
      image:  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      title: "Community Garden Project",
      category: "Community",
      goal: "10",
      raised: "8.5",
      backers: 42,
      daysLeft: 5,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const backedCampaigns = [
    {
      id: 3,
      title: "Clean Ocean Initiative",
      category: "Environment",
      goal: "30",
      raised: "28.5",
      backers: 512,
      daysLeft: 5,
      contributed: "0.5 ETH",
      image:  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      title: "NextGen Smartwatch",
      category: "Technology",
      goal: "50",
      raised: "42.8",
      backers: 214,
      daysLeft: 12,
      contributed: "1.2 ETH",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedData = {...editData, profileImage: e.target?.result as string};
        setEditData(updatedData);
        if (!isEditing) {
          setUserData(updatedData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setUserData(editData);
    setIsEditing(false);
    // Here you would typically send the updated data to your backend
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center">
          <div className="relative mr-6">
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
              {editData.profileImage ? (
                <img src={editData.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                editData.name.substring(0, 1)
              )}
            </div>
            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
              <i className="fas fa-camera text-sm"></i>
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </label>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">@{userData.username}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{userData.bio}</p>
                
                <div className="flex space-x-4">
                  <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    <i className="fas fa-globe mr-1"></i> Website
                  </a>
                  <a href={`https://twitter.com/${userData.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    <i className="fab fa-twitter mr-1"></i> Twitter
                  </a>
                </div>
              </>
            )}
          </div>
          
          {isEditing ? (
            <div className="flex space-x-2">
              <button 
                onClick={handleSaveProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button 
                onClick={handleCancelEdit}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <i className="fas fa-edit mr-2"></i>Edit Profile
            </button>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={editData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={editData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <input
                type="text"
                name="twitter"
                value={editData.twitter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                placeholder="yourusername (without @)"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl p-5 shadow-sm bg-[#286d97] hover:bg-[#2980b9]  border border-white/20 shadow-black/10">
<div className="bg-[#34495e] rounded-xl p-5 border border-white/20 shadow-lg shadow-black/10 hover:border-white/30 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Profile Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'activity' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button 
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'campaigns' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('campaigns')}
            >
              My Campaigns
            </button>
            <button 
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'backed' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('backed')}
            >
              Backed Projects
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-medium mb-4">About Me</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                I'm passionate about supporting innovative projects that make a positive impact on the world. 
                I've been involved in the Web/Blockchain Development space for over 3 years and believe in the power of 
                decentralized crowdfunding to bring creative ideas to life.
              </p>
              
            <h3 className="text-lg font-medium mb-4">Wallet Address</h3>
<div className="bg-[#34495e] border border-white/20 p-3 rounded-lg mb-6 flex items-center justify-between">
  <code className="text-sm break-all text-[#bdc3c7]">{address}</code>
  <button 
    onClick={() => copyToClipboard(address || '')}
    className="ml-2 p-2 rounded-lg hover:bg-[#3a506b] transition-colors"
    title="Copy to clipboard"
  >
    {copied ? (
      <i className="fas fa-check text-green-400"></i>
    ) : (
      <i className="fas fa-copy text-[#3498db]"></i>
    )}
  </button>
</div>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-4">
                      <i className={`fas fa-${activity.action === 'Backed' ? 'hand-holding-usd' : activity.action === 'Created' ? 'plus' : 'external-link-alt'}`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.action} <span className="text-blue-600 dark:text-blue-400">{activity.project}</span>
                        {activity.amount && <span className="ml-2 text-green-600 dark:text-green-400">({activity.amount})</span>}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'campaigns' && (
            <div>
              <h3 className="text-lg font-medium mb-4">My Campaigns</h3>
              {userCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userCampaigns.map(campaign => (
                    <div key={campaign.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow">
                      <div className="h-40 overflow-hidden">
                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold">{campaign.title}</h4>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Raised: {campaign.raised} ETH</span>
                          <span>Goal: {campaign.goal} ETH</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-2">
                          <span>{campaign.backers} backers</span>
                          <span>{campaign.daysLeft} days left</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-folder-open text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 dark:text-gray-400">You haven't created any campaigns yet.</p>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Create Your First Campaign
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'backed' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Projects I've Backed</h3>
              {backedCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {backedCampaigns.map(campaign => (
                    <div key={campaign.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow">
                      <div className="h-40 overflow-hidden">
                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold">{campaign.title}</h4>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Raised: {campaign.raised} ETH</span>
                          <span>Goal: {campaign.goal} ETH</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-2">
                          <span>{campaign.backers} backers</span>
                          <span>{campaign.daysLeft} days left</span>
                        </div>
                        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                          You contributed: {campaign.contributed}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-hands-helping text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 dark:text-gray-400">You haven't backed any projects yet.</p>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Discover Projects
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;