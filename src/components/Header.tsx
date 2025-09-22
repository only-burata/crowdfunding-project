import WalletConnector from './WalletConnector';

interface HeaderProps {
  setIsMobileOpen?: (isOpen: boolean) => void;
  isMobileOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ setIsMobileOpen, isMobileOpen }) => {
    return (
      <header className="bg-[#34495e] shadow-sm py-4 px-6 flex justify-between items-center">
            <div className="flex-1 max-w-xl">
                <div className = "relative">
                    <i className = "fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                </div>
            </div>

            <div className= "flex items-center space-x-4 ml-6">
                <button className= "p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <i className= "fas fa-bell"></i>
                </button>
                <button className = "p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <i className= "fas fa-envelope"></i>
                </button>
               {setIsMobileOpen && (
  <button 
    className="md:hidden p-2 text-white"
    onClick={() => setIsMobileOpen(!isMobileOpen)}
  >
    <i className={`fas fa-${isMobileOpen ? 'times' : 'bars'} text-xl`}></i>
  </button>
)}
                <WalletConnector />
            </div>
        </header>
    );
};

export default Header;