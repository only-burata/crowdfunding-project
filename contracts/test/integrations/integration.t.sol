// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {CampaignManager} from "src/CampaignManager.sol";
import {Campaign} from "src/Campaign.sol";

contract IntegrationTest is Test {
    CampaignManager public manager;
    Campaign public campaign;
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public user3 = address(0x4);

    uint constant DONOR_AMOUNT = 30 ether;
    uint constant CAMPAIGN_GOAL = 100 ether;
    uint constant CAMPAIGN_DURATION = 5 days;

    function setUp() external {
        manager = new CampaignManager();
        vm.deal(user1, 150 ether);
        vm.deal(user2, 150 ether);
        vm.deal(user3, 150 ether);
        vm.prank(owner);
        manager.createCampaign("Interaction", CAMPAIGN_GOAL, CAMPAIGN_DURATION);
        address campaignAddress = manager.getCampaignAddress(owner, 1);
        campaign = Campaign(campaignAddress);
    }

    function testSuccessfulCampaignFlow() external {
        uint256 initialOwnerBalance = owner.balance;
        uint256 initialCampaignBalance = address(campaign).balance;
        //funding the campaign
        vm.prank(user1);
        campaign.donateFunds{value: DONOR_AMOUNT}();
        vm.prank(user2);
        campaign.donateFunds{value: DONOR_AMOUNT}();

        //users trying to claim refund before campaign ends
        vm.prank(user1);
        vm.expectRevert();
        campaign.claimRefund();

        // user trying to withdraw from a campaign they don't own
        vm.prank(user1);
        vm.expectRevert();      
        campaign.withdrawFunds();

        //Owner trying to withdraw before goal is reached
        vm.prank(owner);
        vm.expectRevert();
        campaign.withdrawFunds();

        // More funding to reach the goal
        vm.prank(user3);
        campaign.donateFunds{value: CAMPAIGN_GOAL}();

        // Withdrawing after goal is reached
        uint256 balanceBeforeWithdraw = address(campaign).balance;
        vm.prank(owner);
        campaign.withdrawFunds();

        uint256 finalCampaignBalance = address(campaign).balance;
        uint256 finalOwnerBalance = owner.balance;

        assertEq(finalCampaignBalance, 0);
        assertEq(finalOwnerBalance - initialOwnerBalance, balanceBeforeWithdraw);
        assertEq(finalOwnerBalance - initialOwnerBalance, CAMPAIGN_GOAL + 2 * DONOR_AMOUNT);  

        // Users trying to claim refund after successful campaign
        vm.prank(user1);
        vm.expectRevert();
        campaign.claimRefund();

        // Users trying to donate after successful campaign
        vm.prank(user1);
        vm.expectRevert();
        campaign.donateFunds{value: DONOR_AMOUNT}();

    }

    function testUnsuccessfulCampaignFlow() external {
        uint256 initialUser1Balance = user1.balance;
        uint256 initialUser2Balance = user2.balance;
        // Funding the campaign partially
        vm.prank(user1);
        campaign.donateFunds{value: DONOR_AMOUNT}();
        vm.prank(user2);
        campaign.donateFunds{value: DONOR_AMOUNT}();

        // Fast forward time to after campaign duration
        vm.warp(block.timestamp + (CAMPAIGN_DURATION * 1 days) + 1);
        // Check campaign state
        campaign.checkAndUpdateCampaignState();

        // Users trying to donate after campaign has ended
        vm.prank(user1);
        vm.expectRevert();
        campaign.donateFunds{value: DONOR_AMOUNT}();

        // Owner trying to withdraw from failed campaign
        vm.prank(owner);
        vm.expectRevert();
        campaign.withdrawFunds();

        // Users claiming refunds
        vm.prank(user1);
        campaign.claimRefund();
        vm.prank(user2);
        campaign.claimRefund();

        uint256 finalUser1Balance = user1.balance;
        uint256 finalUser2Balance = user2.balance;

        assertEq(finalUser1Balance, initialUser1Balance);
        assertEq(finalUser2Balance, initialUser2Balance);

        // Users trying to claim refund again
        vm.prank(user1);
        vm.expectRevert();
        campaign.claimRefund();
    }

    function testMultipleCampaignsSeparation() public { 
        // Owner creates Campaign #2 (goal = 100)
        vm.prank(owner);
        campaignManager.createCampaign("Second Campaign", 100 ether, 7);
        address campaign2Addr = campaignManager.getCampaignAddress(owner, 2);
        Campaign campaign2 = Campaign(campaign2Addr);

        // Fund campaign #1 with user1
        vm.deal(user1, 60 ether);
        vm.prank(user1);
        campaignManager.fundCampaign{value: 60 ether}(1, owner);

        // Fund campaign #2 with user2
        vm.deal(user2, 150 ether);
        vm.prank(user2);
        campaignManager.fundCampaign{value: 150 ether}(2, owner);

        // Check contributions are isolated
        assertEq(campaign1.getContribution(user1), 60 ether);
        assertEq(campaign1.getBalance(), 60 ether);

        assertEq(campaign2.getContribution(user2), 150 ether);
        assertEq(campaign2.getBalance(), 150 ether);

        // Move forward in time to expire campaigns
        vm.warp(block.timestamp + 8 days);

        // Refund user1 from campaign #1 (failed)
        vm.prank(user1);
        campaignManager.claimRefundThroughManager(owner, 1);
        assertEq(campaign1.getContribution(user1), 0);

        // Refund user2 from campaign #2 (also failed)
        vm.prank(user2);
        campaignManager.claimRefundThroughManager(owner, 2);
        assertEq(campaign2.getContribution(user2), 0);

        // Both balances should be empty after refunds
        assertEq(campaign1.getBalance(), 0);
        assertEq(campaign2.getBalance(), 0);
    }












    
       

}
