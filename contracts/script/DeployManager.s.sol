// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {CampaignManager} from "../src/CampaignManager.sol";

contract DeployManager is Script {
    function run() external {
        vm.startBroadcast(); // private key will come from CLI

        CampaignManager manager = new CampaignManager();
        console.log("CampaignManager deployed at:", address(manager));

        vm.stopBroadcast();
    }
}
