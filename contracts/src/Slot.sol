// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {KRNL, KrnlPayload, KernelParameter, KernelResponse} from "./KRNL.sol";

contract Slot is KRNL {
    
    // Token Authority public key as a constructor
    constructor(address _tokenAuthorityPublicKey) KRNL(_tokenAuthorityPublicKey) {}

    // Events
    event Bet(address sender, uint256 betAmount, uint256 score);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    // Mapping to track user stakes
    mapping(address => uint256) public stakes;

    //Mapping to track user bets
    mapping(address => uint256[]) public bets;
    
    // Last spin result
    uint256 public lastSpinResult;
    
    // Stake function to deposit funds
    function stake() public payable {
        require(msg.value > 0, "Must stake some ETH");
        stakes[msg.sender] += msg.value;
        emit Staked(msg.sender, msg.value);
    }
    
    // Withdraw function to get back staked funds
    function withdraw(uint256 amount) public {
        require(stakes[msg.sender] >= amount, "Insufficient stake");
        stakes[msg.sender] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        emit Withdrawn(msg.sender, amount);
    }

     // Protected function
    function protectedFunction(
        KrnlPayload memory krnlPayload,
        uint256 betAmount
    )
        external
        onlyAuthorized(krnlPayload, abi.encode(betAmount))
    {
        
        // Decode response from kernel
        KernelResponse[] memory kernelResponses = abi.decode(krnlPayload.kernelResponses, (KernelResponse[]));
        uint256 score;
        for (uint i; i < kernelResponses.length; i ++) {
            // Change the line below to match with your selected kernel(s)
            if (kernelResponses[i].kernelId == 1557) {
                // Change the code below to match with the return data type from this kernel
                score = abi.decode(kernelResponses[i].result, (uint256));
            }
        }

        _bet(score, betAmount);

    }

    // Bet function to spin the slot machine
    function _bet(
        uint256 score,
        uint256 betAmount
    )
       internal
    {
        // Stake cannot be zero
        require(stakes[msg.sender] > 0, "Stake cannot be zero");
        
        // Bet amount cannot be zero
        require(betAmount > 0, "Bet amount cannot be zero");
        
        // User must have enough stake
        require(stakes[msg.sender] >= betAmount, "Insufficient stake for bet");
        
        // Deduct the bet amount from the user's stake
        stakes[msg.sender] -= betAmount;

        // Store the spin result
        lastSpinResult = score;
        
        // Calculate winnings based on the score
        uint256 winnings = calculateWinnings(score, betAmount);
        
        // Add winnings to the user's stake
        if (winnings > 0) {
            stakes[msg.sender] += winnings;
        }

        // Emitting an event with the slot machine result
        emit Bet(msg.sender, betAmount, score);

        // Add the bet to the user's bets array
        bets[msg.sender].push(score);
    }
    
    // Get the last slot machine spin result
    function getLastSpinResult() external view returns (uint256) {
        return lastSpinResult;
    }
    
    // Get the current stake of a user
    function getStake(address user) public view returns (uint256) {
        return stakes[user];
    }

    // Get the user's bets
    function getBets(address user) public view returns (uint256[] memory) {
        return bets[user];
    }
    
    // Calculate winnings based on the slot machine result
    function calculateWinnings(uint256 score, uint256 betAmount) internal pure returns (uint256) {
        // Extract individual digits
        uint256 digit1 = (score / 100) % 10;
        uint256 digit2 = (score / 10) % 10;
        uint256 digit3 = score % 10;
        
        // Special combinations
        
        // Jackpot - Triple 7s (777)
        if (digit1 == 7 && digit2 == 7 && digit3 == 7) {
            return betAmount * 800; // 800x multiplier - highest jackpot
        }
        
        // Triple BAR symbols (represented by 6)
        if (digit1 == 6 && digit2 == 6 && digit3 == 6) {
            return betAmount * 200; // 200x multiplier
        }
        
        // Triple cherries (represented by 5)
        if (digit1 == 5 && digit2 == 5 && digit3 == 5) {
            return betAmount * 100; // 100x multiplier
        }
        
        // Triple bells (represented by 4)
        if (digit1 == 4 && digit2 == 4 && digit3 == 4) {
            return betAmount * 75; // 75x multiplier
        }
        
        // Triple plums (represented by 3)
        if (digit1 == 3 && digit2 == 3 && digit3 == 3) {
            return betAmount * 50; // 50x multiplier
        }
        
        // Triple oranges (represented by 2)
        if (digit1 == 2 && digit2 == 2 && digit3 == 2) {
            return betAmount * 40; // 40x multiplier
        }
        
        // Triple lemons (represented by 1)
        if (digit1 == 1 && digit2 == 1 && digit3 == 1) {
            return betAmount * 30; // 30x multiplier
        }
        
        // Triple watermelons (represented by 0)
        if (digit1 == 0 && digit2 == 0 && digit3 == 0) {
            return betAmount * 25; // 25x multiplier
        }
        
        // Any combination with two 7s
        if ((digit1 == 7 && digit2 == 7) || (digit2 == 7 && digit3 == 7) || (digit1 == 7 && digit3 == 7)) {
            return betAmount * 20; // 20x multiplier
        }
        
        // Any combination with one 7
        if (digit1 == 7 || digit2 == 7 || digit3 == 7) {
            return betAmount * 5; // 5x multiplier
        }
        
        // Any three of a kind (not covered by specific combinations above)
        if (digit1 == digit2 && digit2 == digit3) {
            return betAmount * 15; // 15x multiplier
        }
        
        // Any two of a kind (cherries, bars, etc.)
        if (digit1 == digit2 || digit2 == digit3 || digit1 == digit3) {
            // Two cherries (represented by 5)
            if ((digit1 == 5 && digit2 == 5) || (digit2 == 5 && digit3 == 5) || (digit1 == 5 && digit3 == 5)) {
                return betAmount * 10; // 10x multiplier
            }
            // Two bars (represented by 6)
            if ((digit1 == 6 && digit2 == 6) || (digit2 == 6 && digit3 == 6) || (digit1 == 6 && digit3 == 6)) {
                return betAmount * 8; // 8x multiplier
            }
            // Any other two of a kind
            return betAmount * 3; // 3x multiplier
        }
        
        // Single cherry (represented by 5) - small payout
        if (digit1 == 5 || digit2 == 5 || digit3 == 5) {
            return betAmount * 2; // 2x multiplier
        }
        
        // No winning combination
        return 0;
    }

    // Receive function to accept plain ETH transfers
    receive() external payable {
        stakes[msg.sender] += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    // Fallback function to handle unexpected calls
    fallback() external payable {
        // Accept ETH and treat it as a stake
        if (msg.value > 0) {
            stakes[msg.sender] += msg.value;
            emit Staked(msg.sender, msg.value);
        }
    }
}