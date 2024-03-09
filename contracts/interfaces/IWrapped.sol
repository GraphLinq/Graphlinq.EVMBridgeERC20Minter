// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/**
 * @dev Interface of the IWrapped.
 */
interface IWrapped {
    function wrap() external payable;
    function unwrap(uint256 amount) external;
}