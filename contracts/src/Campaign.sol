// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Campaign {
    error NotOwner();
    error GoalNotReached();
    error NotEnoughFundsSent();
    error CampaignNotOpen();
    error CampaignFailed();
    error NoRefundAvailable();
    error CampaignNotFailed();
    error CampaignNotEnded();

    enum CampaignState {
        Active,
        Successful,
        Failed
    }

    CampaignState private state;

    address private immutable i_owner;
    uint256 private immutable i_goal;
    string private title;
    string private imgUrl;
    string private description;
    uint256 private immutable i_duration;
    uint256 private immutable i_startTime;

    address[] private s_senders;
    mapping(address => uint256) private s_sendersToAmountFunded;

    event FundsDonated(address indexed donor, uint256 amount, address indexed campaign);
    event FundsWithdrawn(address indexed owner, uint256 amount, address indexed campaign);
    event RefundClaimed(address indexed sender, uint256 amount, address indexed campaign);

    constructor(address owner, string memory _title, uint256 goal, uint256 durationIndays, string memory _imgUrl, string memory _description) {
        i_owner = owner;
        i_goal = goal;
        title = _title;
        state = CampaignState.Active;
        i_duration = block.timestamp + (durationIndays * 1 days);
        i_startTime = block.timestamp;
        imgUrl = _imgUrl;
        description = _description;
    }

    function checkAndUpdateCampaignState() public {
        if (state == CampaignState.Active) {
            if (block.timestamp >= i_duration) {
                if (address(this).balance >= i_goal) {
                    state = CampaignState.Successful;
                } else {
                    state = CampaignState.Failed;
                }
            } else {
                if (address(this).balance >= i_goal) {
                    state = CampaignState.Successful;
                } else {
                    state = CampaignState.Active;
                }
            }
        }
    }

    function donateFunds() public payable {
        if (state != CampaignState.Active) {
            revert CampaignNotOpen();
        }
        if (msg.value == 0) {
            revert NotEnoughFundsSent();
        }
        if (s_sendersToAmountFunded[msg.sender] == 0) {
            s_senders.push(msg.sender);
        }
        s_sendersToAmountFunded[msg.sender] += msg.value;

        checkAndUpdateCampaignState();

        emit FundsDonated(msg.sender, msg.value, address(this));
    }

    function withdrawFunds() external {
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        checkAndUpdateCampaignState();
        if (state != CampaignState.Successful) {
            revert GoalNotReached();
        }
        uint256 balance = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: balance}("");
        require(success);

        emit FundsWithdrawn(i_owner, balance, address(this));
    }

    function claimRefund() external {
        checkAndUpdateCampaignState();
        if (state != CampaignState.Failed) {
            revert CampaignNotFailed();
        }

        uint256 amount = s_sendersToAmountFunded[msg.sender];
        if (amount == 0) {
            revert NoRefundAvailable();
        }
        s_sendersToAmountFunded[msg.sender] = 0;

        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");

        emit RefundClaimed(msg.sender, amount, address(this));
    }
    /**
     * @notice Returns the remaining time in seconds until the campaign ends.
     * @return The number of seconds left; returns 0 if the campaign has ended.
     */

    function getTimeLeft() external view returns (uint256) {
        if (block.timestamp >= i_duration) {
            return 0;
        } else {
            return i_duration - block.timestamp;
        }
    }

    /**
     * Getters
     */
    function getOwner() external view returns (address) {
        return i_owner;
    }

    function getGoal() external view returns (uint256) {
        return i_goal;
    }

    function getTitle() external view returns (string memory) {
        return title;
    }

    function getSenders() external view returns (address[] memory) {
        return s_senders;
    }

    function getContribution(address donor) external view returns (uint256) {
        return s_sendersToAmountFunded[donor];
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getDuration() external view returns (uint256) {
        return i_duration;
    }

    function getState() external view returns (CampaignState) {
        return state;
    }

    function getStartTime() external view returns (uint256) {
        return i_startTime;
    }

    function getEndTime() external view returns (uint256) {
        return i_duration;
    }
    function getImgUrl() external view returns (string memory){
        return imgUrl;
    }
    // receive() external payable {
    //     donateFunds();
    // }

    // fallback() external payable {
    //     donateFunds();
    // }
}
