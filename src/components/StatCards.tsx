import React from 'react';

const StatsCards: React.FC = () => {
     const stats = [
    {
      title: "Total Raised",
      value: "$245,321",
      icon: "fas fa-hand-holding-usd",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-300"
    },
    {
      title: "Active Backers",
      value: "12,456",
      icon: "fas fa-users",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-300"
      },
    {
      title: "Live Campaigns",
      value: "342",
      icon: "fas fa-rocket",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-300"
    },
    {
      title: "Success Rate",
      value: "78%",
      icon: "fas fa-trophy",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-300"
    }
     ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div className="bg-[#286d97] hover:bg-[#2980b9] rounded-xl p-5 shadow-sm border border-[#3a506b]bg-[#34495e] border-white/20 shadow-black/10">
<div className="bg-[#34495e] rounded-xl p-5 border border-white/20 shadow-lg shadow-black/10 hover:border-white/30 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.iconBg} ${stat.iconColor} mr-4`}>
              <i className={`${stat.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-sm text-gray-400 dark:text-gray-400">{stat.title}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;