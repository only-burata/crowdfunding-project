// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Campaign} from "../../src/Campaign.sol";

contract CampaignTest is Test {
    Campaign public campaign;
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public user3 = address(0x4);

    uint256 public constant GOAL = 100 ether;
    uint256 public constant LESS_THAN_GOAL = 10 ether;
    uint256 public constant MORE_THAN_GOAL = 110 ether;
    uint256 public constant DURATION_IN_DAYS = 7;
    uint256 public constant USER1_AMOUNT = 5 ether;
    uint256 public constant USER2_AMOUNT = 3 ether;
    uint256 public constant USER3_AMOUNT = 2 ether;

    function setUp() external {
        vm.prank(owner);
        campaign = new Campaign(owner, "Test Campaign", GOAL, DURATION_IN_DAYS, "http://localhost", "description");
        vm.deal(user1, 200 ether);
        vm.deal(user2, 200 ether);
    }

    function testOwnerIsSetCorrectly() external view {
        address campaignOwner = campaign.getOwner();
        assertEq(campaignOwner, owner);
    }

    function testInitialStateIsActive() external view {
        Campaign.CampaignState state = campaign.getState();
        assertEq(uint256(state), uint256(Campaign.CampaignState.Active));
    }

    function testCheckAndUpdateCampaignState() external {
        vm.prank(user1);
        campaign.donateFunds{value: LESS_THAN_GOAL}();

        // Check state remains active before duration ends
        Campaign.CampaignState state = campaign.getState();
        assertEq(uint256(state), uint256(Campaign.CampaignState.Active));
        // Fast forward time beyond duration
        vm.warp(block.timestamp + (DURATION_IN_DAYS * 1 days) + 1);
        vm.prank(owner);
        campaign.checkAndUpdateCampaignState();
        // Check state is failed after duration ends
        Campaign.CampaignState stateAfter = campaign.getState();
        assertEq(uint256(stateAfter), uint256(Campaign.CampaignState.Failed));
    }

    function testDonateFundsRevertsIfNoFundsSent() external {
        vm.prank(user1);
        vm.expectRevert();
        campaign.donateFunds();
    }

    function testDonateFundsRevertsIfStateNotActive() external {
        vm.prank(user1);
        campaign.donateFunds{value: GOAL}();

        // Explicitly finalize the campaign to ensure state is not active
        vm.prank(owner);
        campaign.checkAndUpdateCampaignState();

        vm.prank(user2);
        vm.expectRevert();
        campaign.donateFunds{value: USER2_AMOUNT}();
    }

    function testDonateFundsUpdatesState() external {
        vm.prank(user1);
        campaign.donateFunds{value: USER1_AMOUNT}();

        vm.prank(user2);
        campaign.donateFunds{value: USER2_AMOUNT}();

        uint256 user1Contribution = campaign.getContribution(user1);
        uint256 user2Contribution = campaign.getContribution(user2);
        address[] memory senders = campaign.getSenders();

        assertEq(senders.length, 2);
        assertEq(senders[0], user1);
        assertEq(senders[1], user2);
        assertEq(user1Contribution, USER1_AMOUNT);
        assertEq(user2Contribution, USER2_AMOUNT);
    }

    function testCampaignBecomesSuccessfulAfterGoalReached() external {
        vm.prank(user1);
        campaign.donateFunds{value: GOAL}();

        Campaign.CampaignState state = campaign.getState();
        assertEq(uint256(state), uint256(Campaign.CampaignState.Successful));
    }

    function testCampaignFailsIfGoalNotReached() external {
        vm.prank(user1);
        campaign.donateFunds{value: LESS_THAN_GOAL}();

        vm.warp(block.timestamp + (DURATION_IN_DAYS * 1 days) + 1);
        vm.prank(owner);
        campaign.checkAndUpdateCampaignState();

        Campaign.CampaignState state = campaign.getState();
        assertEq(uint256(state), uint256(Campaign.CampaignState.Failed));
    }

    function testOnlyOwnerCanWithdrawFunds() external {
        vm.prank(user1);
        campaign.donateFunds{value: GOAL}();

        vm.expectRevert();
        campaign.withdrawFunds();

        uint256 ownerInitialBalance = owner.balance;
        vm.prank(owner);
        campaign.withdrawFunds();
        uint256 ownerFinalBalance = owner.balance;

        assertEq(ownerFinalBalance - ownerInitialBalance, GOAL);
    }

    function testWithdrawFailsIfCampaignFailed() external {
        vm.prank(user1);
        campaign.donateFunds{value: LESS_THAN_GOAL}();

        vm.warp(block.timestamp + (DURATION_IN_DAYS * 1 days) + 1);
        vm.prank(owner);
        campaign.checkAndUpdateCampaignState();

        vm.prank(owner);
        vm.expectRevert();
        campaign.withdrawFunds();
    }

    function testWithdrawFailsIfCampaignActive() external {
        vm.prank(user1);
        campaign.donateFunds{value: LESS_THAN_GOAL}();

        vm.prank(owner);
        vm.expectRevert();
        campaign.withdrawFunds();
    }

    function testWithdrawal() external {
        vm.prank(user1);
        campaign.donateFunds{value: GOAL}();
        uint256 ownerInitialBalance = owner.balance;

        vm.prank(owner);
        campaign.withdrawFunds();
        uint256 ownerFinalBalance = owner.balance;

        assertEq(ownerFinalBalance - ownerInitialBalance, GOAL);
    }

    function testClaimRefundFailsIfCampaignActive() external {
        vm.prank(user1);
        campaign.donateFunds{value: LESS_THAN_GOAL}();

        vm.prank(user1);
        vm.expectRevert();
        campaign.claimRefund();
    }

    function testClaimRefundFailsIfCampaignSuccessful() external {
        vm.prank(user1);
        campaign.donateFunds{value: GOAL}();

        vm.prank(user1);
        vm.expectRevert();
        campaign.claimRefund();
    }

    function testClaimRefund() external {
        vm.prank(user1);
        campaign.donateFunds{value: LESS_THAN_GOAL}();

        vm.warp(block.timestamp + (DURATION_IN_DAYS * 1 days) + 1);
        vm.prank(owner);
        campaign.checkAndUpdateCampaignState();

        uint256 userInitialBalance = user1.balance;
        vm.prank(user1);
        campaign.claimRefund();
        uint256 userFinalBalance = user1.balance;

        assertEq(userFinalBalance - userInitialBalance, LESS_THAN_GOAL);
    }

    function testGetTitle() external view {
        string memory campaignTitle = campaign.getTitle();
        assertEq(keccak256(abi.encodePacked(campaignTitle)), keccak256(abi.encodePacked("Test Campaign")));
    }
}
