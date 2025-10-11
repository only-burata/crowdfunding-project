// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Campaign} from "./Campaign.sol";

contract CampaignManager {
    error CampaignDoesNotExist();

    // Maps owner address to campaign id to campaign address
    mapping(address => mapping(uint256 => address)) private userCampaigns;
    // Maps owner address to number of campaigns created
    mapping(address => uint256) public userCampaignCount;

    address[] private campaignCreators;

    event CampaignCreated(address indexed owner, uint256 indexed id, address campaignAddress);

    function createCampaign(string calldata name, uint256 goal, uint256 durationInDays, string calldata imgUrl, string calldata description) external {
        if (userCampaignCount[msg.sender] == 0) {
            campaignCreators.push(msg.sender);
        }
        uint256 newId = userCampaignCount[msg.sender] + 1;
        userCampaignCount[msg.sender] = newId;

        Campaign campaign = new Campaign(msg.sender, name, goal, durationInDays, imgUrl, description);
        userCampaigns[msg.sender][newId] = address(campaign);

       

        emit CampaignCreated(msg.sender, newId, address(campaign));
    }

    function getCampaignAddress(address owner, uint256 id) external view returns (address) {
        return userCampaigns[owner][id];
    }

    function getUserCampaignCount(address owner) external view returns (uint256) {
        return userCampaignCount[owner];
    }

    function getCampaignCreators() external view returns(address[] memory){
        return campaignCreators;
    }
}
