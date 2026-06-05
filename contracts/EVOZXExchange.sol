// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface IERC20 {

function transfer(
    address to,
    uint256 amount
) external returns (bool);

function balanceOf(
    address account
) external view returns (uint256);

}

contract EVOZXExchange {

address public owner;

address public treasury;

IERC20 public immutable evozx;

uint256 public rate;

bool public paused;

event EVOZXPurchased(
    address indexed buyer,
    uint256 evozPaid,
    uint256 evozxReceived
);

event RateUpdated(
    uint256 oldRate,
    uint256 newRate
);

event TreasuryUpdated(
    address oldTreasury,
    address newTreasury
);

event OwnershipTransferred(
    address oldOwner,
    address newOwner
);

event PauseUpdated(
    bool status
);

event EVOZXWithdrawn(
    address indexed to,
    uint256 amount
);

modifier onlyOwner() {

    require(
        msg.sender == owner,
        "Not owner"
    );

    _;
}

modifier notPaused() {

    require(
        !paused,
        "Exchange paused"
    );

    _;
}

constructor() {

    owner = msg.sender;

    treasury =
        0x50Cd30Ff7f0fbBD9d0FDe1F60DE8c52D6F390c5C;

    evozx =
        IERC20(
            0x032a962F62Fc1cbc15B19767Aa138deA3B454B74
        );

    rate = 5;

    paused = false;
}

function buyEVOZX()
    external
    payable
    notPaused
{

    require(
        msg.value > 0,
        "No EVOZ sent"
    );

    uint256 evozxAmount =
        msg.value / rate;

    require(
        evozxAmount > 0,
        "Amount too small"
    );

    require(
        evozx.balanceOf(
            address(this)
        ) >= evozxAmount,
        "Insufficient stock"
    );

    (bool success,) =
        payable(
            treasury
        ).call{
            value: msg.value
        }("");

    require(
        success,
        "Treasury transfer failed"
    );

    require(
        evozx.transfer(
            msg.sender,
            evozxAmount
        ),
        "EVOZX transfer failed"
    );

    emit EVOZXPurchased(
        msg.sender,
        msg.value,
        evozxAmount
    );
}

function setRate(
    uint256 newRate
)
    external
    onlyOwner
{

    require(
        newRate > 0,
        "Invalid rate"
    );

    uint256 oldRate =
        rate;

    rate =
        newRate;

    emit RateUpdated(
        oldRate,
        newRate
    );
}

function setTreasury(
    address newTreasury
)
    external
    onlyOwner
{

    require(
        newTreasury !=
        address(0),
        "Invalid treasury"
    );

    address oldTreasury =
        treasury;

    treasury =
        newTreasury;

    emit TreasuryUpdated(
        oldTreasury,
        newTreasury
    );
}

function transferOwnership(
    address newOwner
)
    external
    onlyOwner
{

    require(
        newOwner !=
        address(0),
        "Invalid owner"
    );

    address oldOwner =
        owner;

    owner =
        newOwner;

    emit OwnershipTransferred(
        oldOwner,
        newOwner
    );
}

function setPaused(
    bool status
)
    external
    onlyOwner
{

    paused =
        status;

    emit PauseUpdated(
        status
    );
}

function withdrawEVOZX(
    uint256 amount
)
    external
    onlyOwner
{

    require(
        amount > 0,
        "Invalid amount"
    );

    require(
        evozx.transfer(
            treasury,
            amount
        ),
        "Withdraw failed"
    );

    emit EVOZXWithdrawn(
        treasury,
        amount
    );
}

function emergencyWithdraw()
    external
    onlyOwner
{

    uint256 balance =
        evozx.balanceOf(
            address(this)
        );

    require(
        balance > 0,
        "No EVOZX"
    );

    require(
        evozx.transfer(
            treasury,
            balance
        ),
        "Withdraw failed"
    );

    emit EVOZXWithdrawn(
        treasury,
        balance
    );
}

function withdrawNative()
    external
    onlyOwner
{

    uint256 balance =
        address(this).balance;

    require(
        balance > 0,
        "No EVOZ"
    );

    (bool success,) =
        payable(
            treasury
        ).call{
            value: balance
        }("");

    require(
        success,
        "Transfer failed"
    );
}

function getAvailableStock()
    external
    view
    returns(uint256)
{

    return
        evozx.balanceOf(
            address(this)
        );
}

receive()
    external
    payable
{

    revert(
        "Use buyEVOZX()"
    );
}

}
