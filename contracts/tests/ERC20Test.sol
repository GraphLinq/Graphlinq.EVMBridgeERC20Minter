// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ERC20Test {
    string public name = "TESTToken";
    string public symbol = "TST";
    uint8 public decimals = 18;
    uint256 public totalSupply = (10000 * (10 ** decimals));

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor () {
        balanceOf[msg.sender] = totalSupply;
    }

    function approve(address _spender, uint256 _value) public {
        allowance[msg.sender][_spender] = _value;
    }

    function transfer(address _to, uint256 _value) public {
        require(_value <= balanceOf[msg.sender], "Insufficient balance");
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;
    }

    function transferFrom(address _from, address _to, uint256 _value) public {
        require(_value <= balanceOf[_from] && _value <= allowance[_from][msg.sender], "Insufficient balance or allowance");
        balanceOf[_from] = balanceOf[_from] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;
    }
}
