export const CAMPAIGN_MANAGER_ADDRESS = "0x31696FB200d382E3b557bD4AD8d33069c0AE590D";
export const CAMPAIGN_MANAGER_ABI = [
    //ABI goes here ooo
    "./CampaignABI.json",

    "function createCampaign (string name, uint256 goal, uint256 durationInDays, external)",
    "function getCampaignAddress(address owner, uint256 id) external view returns (address)",
    "function getUserCampaignCount(address owner) external view returns (uint256)",
    "event CampaignCreated(address indexed owner, uint256 indexed id, address campaignAddress)",
];

export const CAMPAIGN_ABI = [

//ABI contract goes here 
 "./CampaignABI.json",

"function donateFunds() public payable",
 "function withdrawFunds() external",
  "function claimRefund() external",
  "function checkAndUpdateCampaignState() public",
  "function getTimeLeft() external view returns (uint256)",
  "function getOwner() external view returns (address)",
  "function getGoal() external view returns (uint256)",
  "function getTitle() external view returns (string)",
  "function getSenders() external view returns (address[])",
  "function getContribution(address donor) external view returns (uint256)",
  "function getBalance() external view returns (uint256)",
  "function getDuration() external view returns (uint256)",
  "function getState() external view returns (uint8)",
  "function getStartTime() external view returns (uint256)",
  "function getEndTime() external view returns (uint256)",
  "event FundsDonated(address indexed donor, uint256 amount, address indexed campaign)",
  "event FundsWithdrawn(address indexed owner, uint256 amount, address indexed campaign)",
  "event RefundClaimed(address indexed sender, uint256 amount, address indexed campaign)"
];
