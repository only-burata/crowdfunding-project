import {useAccount, useReadContract, useWriteContract} from 'wagmi';
import { CAMPAIGN_MANAGER_ADDRESS, CAMPAIGN_MANAGER_ABI} from '../utils/constants';

export const useCampaignManager = () => {
    const {address} = useAccount();
    const {writeContract} = useWriteContract();

    //To Create campaign
    const createCampaign = (name: string, goal: bigint, duration: number) => {
      return writeContract ({
        address: CAMPAIGN_MANAGER_ADDRESS,
        abi: CAMPAIGN_MANAGER_ABI,
        functionName: 'createCampaign',
        args: [name, goal, duration],
    });
  };


//To Get campaign user count
     const { data: userCampaignCount } = useReadContract({
    address: CAMPAIGN_MANAGER_ADDRESS,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'getUserCampaignCount',
    args: [address],
  });

  //To Get campaign address
  const getCampaignAddress = (id: number) => {
    const { data: campaignAddress } = useReadContract({
      address: CAMPAIGN_MANAGER_ADDRESS,
      abi: CAMPAIGN_MANAGER_ABI,
      functionName: 'getCampaignAddress',
      args: [address, id],
    });
    return campaignAddress;
  };


  return {
    createCampaign,
    userCampaignCount,
    getCampaignAddress,
  };
};
