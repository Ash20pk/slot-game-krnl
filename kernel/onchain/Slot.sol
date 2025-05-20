// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SlotMachine {
    /// @notice Spins a slot machine and returns a 3-digit number (000–999)
    /// @param seed Any user-defined input (wallet, timestamp, etc.)
    /// @return result A number like 777, 123, etc.
    function spin(uint256 seed) public view returns (uint256 result) {
        // Using block information for additional randomness
        uint256 combinedSeed = seed + block.timestamp + block.number;
        
        uint256 slot1 = (uint256(keccak256(abi.encodePacked(combinedSeed, "slot1"))) % 10);
        uint256 slot2 = (uint256(keccak256(abi.encodePacked(combinedSeed, "slot2"))) % 10);
        uint256 slot3 = (uint256(keccak256(abi.encodePacked(combinedSeed, "slot3"))) % 10);
        
        result = slot1 * 100 + slot2 * 10 + slot3;
    }
}
