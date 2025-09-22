import {createConfig, http} from 'wagmi';
import {sepolia} from 'wagmi/chains'; //import chains you might use
import {metaMask} from 'wagmi/connectors';
import {walletConnect} from 'wagmi/connectors';
import {coinbaseWallet} from 'wagmi/connectors';

const config = createConfig({
  connectors: [
    metaMask(),
    walletConnect({
      projectId: 'your-walletconnect-project-id', // Get from https://cloud.walletconnect.com/
    }),
    coinbaseWallet({
      appName: 'Your Crowdfunding Project', // Required parameter
    }),
  ],
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(), // Use http() instead of publicProvider
  },
});

export default config;