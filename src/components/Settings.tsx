import React from 'react';

const Settings: React.FC = () => {
  const settingsOptions = [
    {
      title: "Account Settings",
      description: "Manage your account preferences",
      icon: "fas fa-user-cog",
      options: [
        { name: "Profile Information", action: () => {} },
        { name: "Change Password", action: () => {} },
        { name: "Two-Factor Authentication", action: () => {} }
      ]
    },
    {
      title: "Notification Preferences",
      description: "Control how we notify you",
      icon: "fas fa-bell",
      options: [
        { name: "Email Notifications", action: () => {} },
        { name: "Push Notifications", action: () => {} },
        { name: "SMS Alerts", action: () => {} }
      ]
    },
    {
      title: "Privacy & Security",
      description: "Manage your data and security",
      icon: "fas fa-shield-alt",
      options: [
        { name: "Privacy Settings", action: () => {} },
        { name: "Data Export", action: () => {} },
        { name: "Account Recovery", action: () => {} }
      ]
    },
    {
      title: "Blockchain Preferences",
      description: "Configure blockchain settings",
      icon: "fas fa-link",
      options: [
        { name: "Default Network", action: () => {} },
        { name: "Gas Preferences", action: () => {} },
        { name: "Transaction Settings", action: () => {} }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {settingsOptions.map((section, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mr-4">
                <i className={`${section.icon} text-xl`}></i>
              </div>
              <div>
                <h3 className="font-bold text-lg text-blue-500">{section.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{section.description}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {section.options.map((option, optIndex) => (
                <div 
                  key={optIndex} 
                  className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors text-gray-600"
                  onClick={option.action}
                >
                  <span>{option.name}</span>
                  <i className="fas fa-chevron-right text-gray-800"></i>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;