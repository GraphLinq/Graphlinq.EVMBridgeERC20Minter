// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/**
 * @dev Interface of the IWrapped.
 */
interface IBridge {
    function initTransfer(uint256 quantity, string calldata toChain, string calldata data) external payable;
    function addTransfersFrom(string[] memory /* fromChains */, address[] memory transfersAddresses, uint256[] memory amounts, bytes32[] memory _transfersHashs) external;
}