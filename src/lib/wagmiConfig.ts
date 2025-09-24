import {createConfig, http} from 'wagmi';
import {sepolia} from 'wagmi/chains'; //we should import chains we might use
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
      appName: 'Your Crowdfunding Project',
    }),
  ],
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(), //note Use http() instead of publicProvider
  },
});

export default config;