import {useState} from 'react';
import {useAccount, useConnect, useDisconnect} from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors';

const WalletConnector: React.FC = () => {
    const {address, isConnected} = useAccount();
const { connect } = useConnect();
 const { disconnect } = useDisconnect();
 const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false); // Add this state

  // Add copy function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

 const connectors = [
    { name: 'MetaMask',
        icon:'fab fa-metaMask',
         connector: injected() },

    { name: 'WalletConnect',
        icon: 'fab fa-wallet',
         connector: walletConnect({ projectId: 'your-project-id'
        }) }, //Replace with actual project id

    { name: 'Coinbase Wallet',
        icon: 'fas fa-coinbaseWallet',
         connector: coinbaseWallet({
        appName: 'Your Crowdfunding Project' // Required parameter 
        }) },
  ];

   const handleConnect = (connector: any) => {
    connect({ connector });
    setShowMenu(false);
   };

  return (
    <div className="wallet-connector">
      {isConnected ? (
        <div className="flex items-center">
          <div 
            className="flex items-center cursor-pointer bg-[#d3e2f1] hover:bg-[#2980b9] dark:bg-blue-900/30 px-3 py-1 rounded-lg"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="w-6 h-6 rounded-full  bg-blue-500 flex items-center justify-center text-white text-xs font-medium mr-2">
              {address?.substring(2, 4).toUpperCase()}
            </div>
            <span className="text-sm">
              {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
            </span>
            <i className={`fas fa-chevron-${showMenu ? 'up' : 'down'} ml-2 text-xs`}></i>
          </div>
          
          {showMenu && (
            <div className="wallet-menu">
              <div className="wallet-option" onClick={() => disconnect()}>
                <i className="fas fa-sign-out-alt"></i>
                Disconnect
              </div>
               <div className="wallet-option" onClick={() => copyToClipboard(address || '')}>
                {copied ? (
                  <div className="flex items-center text-green-400">
                    <i className="fas fa-check mr-2"></i>
                    <span>Copied!</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <i className="fas fa-copy mr-2"></i>
                    <span>Copy Address</span>
                  </div>
                )}
              </div>
              <div className="wallet-option">
                <i className="fas fa-external-link-alt"></i>
                View on Explorer
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="bg-[#083855] hover:bg-[#2980b9] text-white px-4 py-2 rounded-lg flex items-center btn-hover"
          >
            <i className="fas fa-wallet mr-2"></i>
            Connect Wallet
            <i className={`fas fa-chevron-${showMenu ? 'up' : 'down'} ml-2 text-xs`}></i>
          </button>
          
          {showMenu && (
            <div className="wallet-menu">
              {connectors.map((connector, index) => (
                <div 
                  key={index} 
                  className="wallet-option"
                  onClick={() => handleConnect(connector.connector)}
                >
                  <i className={connector.icon}></i>
                  {connector.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnector;