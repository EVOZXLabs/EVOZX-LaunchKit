// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract EVOZXToken is ERC20, ERC20Burnable {

    address public creator;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 supply_,
        address creator_
    ) ERC20(name_, symbol_) {

        creator = creator_;

        _mint(
            creator_,
            supply_ * 10 ** decimals()
        );
    }
}
