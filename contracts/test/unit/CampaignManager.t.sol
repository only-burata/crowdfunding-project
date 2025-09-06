// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {CampaignManager} from "../../src/CampaignManager.sol";
import {Campaign} from "../../src/Campaign.sol";

contract CampaignManagerTest is Test {
    CampaignManager public campaignManager;
    Campaign public campaign;
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    function setUp() external {
        campaignManager = new CampaignManager();
        vm.deal(user1, 200 ether);
        vm.deal(user2, 200 ether);
    }

    function testCreateCampaign() external {
        vm.prank(owner);
        campaignManager.createCampaign("Test Campaign", 100 ether, 7);

        address campaignAddress = campaignManager.userCampaigns(owner, 1);
        assert(campaignAddress != address(0));
    }

    function testCreateCampaignOwnerIsCorrect() external {
        vm.prank(owner);
        campaignManager.createCampaign("Test Campaign", 100 ether, 7);
        address campaignAddress = campaignManager.userCampaigns(owner, 1);

        //Check that the campaign address is not zero
        assert(campaignAddress != address(0));

        campaign = Campaign(campaignAddress);
        address campaignOwner = campaign.getOwner();

        //check that the owner of the campaign is the same as the owner who created it
        assert(campaignOwner == owner);
    }

    function testCreateCampaignIncrementsCampaignCount() external {
        uint256 initialCount = campaignManager.getUserCampaignCount(owner);
        vm.prank(owner);
        campaignManager.createCampaign("Test Campaign", 100 ether, 7);
        uint256 newCount = campaignManager.getUserCampaignCount(owner);
        assert(newCount == initialCount + 1);
    }

}
