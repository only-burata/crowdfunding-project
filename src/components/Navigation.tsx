import React, {useState, useEffect} from 'react';

interface NavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Update navItems to include Profile
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
    { id: 'discover', label: 'Discover', icon: 'fas fa-fire' },
    { id: 'my-campaigns', label: 'My Campaigns', icon: 'fas fa-heart' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' }, // Added Profile
    { id: 'bookmarks', label: 'Bookmarks', icon: 'fas fa-bookmark' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
  ];

  const handleGetHelp = () => {
    // Open WhatsApp with your number
    window.open('https://wa.me/1234567890', '_blank');
  };

  return (
    <div className={`w-64 bg-[#34495e] shadow-lg flex flex-col fixed md:relative h-full z-40 transition-transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
    <div className="w-64 bg-[#34495e] shadow-lg flex flex-col">
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
            <i className="fas fa-hand-holding-heart text-white"></i>
          </div>
          <h1 className="text-xl font-bold">Blue<span className="text-blue-600 dark:text-blue-400">Fund</span></h1>
        </div>
      </div>
      
      <nav className="flex-1 mt-6">
        {navItems.map(item => (
          <div 
            key={item.id}
            className={`nav-item py-3 px-6 flex items-center cursor-pointer ${activeTab === item.id ? 'nav-active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <i className={`${item.icon} mr-3`}></i>
            {item.label}
          </div>
        ))}
      </nav>
      
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Dark Mode</span>
          <label className="theme-switch">
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 dark:text-blue-200">Need help?</h3>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Contact us on WhatsApp for support</p>
          <button 
            onClick={handleGetHelp}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm btn-hover"
          >
            <i className="fab fa-whatsapp mr-2"></i>Get Help
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Navigation;