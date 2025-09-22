// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {CampaignManager} from "../../src/CampaignManager.sol";
import {Campaign} from "../../src/Campaign.sol";
import {DeployManager} from "../../script/DeployManager.s.sol";

contract DeployCampaignManagerTest is Test {
    DeployManager deployScript;
    CampaignManager public campaignManager;

    function setUp() external {
        deployScript = new DeployManager();
        deployScript.run();
        campaignManager = CampaignManager(address(deployScript));
    }

    function testDeployment() external {
        assert(address(campaignManager) != address(0));
    }
}
