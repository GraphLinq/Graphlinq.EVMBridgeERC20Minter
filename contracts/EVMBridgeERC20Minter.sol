// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "./erc20/ERC20.sol";
import "./utils/TransferHelper.sol";
import "./libs/SafeMath.sol";
import "./libs/SignedSafeMath.sol";

contract EVMBridgeERC20Minter is ERC20 {

    using SafeMath for uint256;
    using SignedSafeMath for int256;

    address public owner;
    address public program;
    string  public chain;

    uint256 public feesInDollar;
    uint256 public defaultFeesInETH;
    uint256 public minimumTransferQuantity;

    //event emitted when new transfer on GLQ bridge
    event BridgeTransfer(
        uint256 amount,
        string  toChain
    );

    mapping(address => mapping(uint256 => bool)) transfers;

    // Private dex information
    address private dex_in;
    address private dex_out;
    address private dex_pool;

    bool internal paused;
    bool internal locked;

    event NewBridgeTransferEvent(bytes32 hash);

    constructor(
        string memory _bridgeChain,
        uint256 _feesInDollar,
        uint256 _minimumTransferQuantity,
        string memory name,
        string memory symbol) ERC20(name, symbol, 0, 18) {
        require(_msgSender() != address(0), "Bridge: deploy from the zero address");
        owner = _msgSender();
        program = _msgSender();
        chain = _bridgeChain;
        feesInDollar = _feesInDollar;
        minimumTransferQuantity = _minimumTransferQuantity;
        defaultFeesInETH = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do this action");
        _;
    }

    modifier onlyProgramOrOwner() {
        require(msg.sender == program || msg.sender == owner, "Only program or Owner");
        _;
    }

    modifier activated() {
        require(paused == false, "Bridge actually paused");
        _;
    }

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    function getFeesInDollar() public view returns (uint256) {
        return feesInDollar;
    }

    function setFeesInDollar(uint256 cost) public onlyOwner {
        feesInDollar = cost;
    }

    function setDefaultFeesInETH(uint256 cost) public onlyOwner {
        defaultFeesInETH = cost;
    }

    function getFeesInETH() public view returns (uint256) {
        if (dex_pool != address(0)) {
            uint256 oneDollar = getTokenPriceOutFromPoolBalance(dex_in, dex_out, dex_pool);
            return oneDollar.mul(1 ether).div(feesInDollar).mul(100); // multiplication 1 ether pour decaler les decimals.
        }
        return defaultFeesInETH;
    }

    function wrap() public payable noReentrant {
        require(msg.value >= 0,
            "PAYMENT_ABORT"
        );
        (bool success, bytes memory data) = address(this).call(abi.encodeWithSelector(0x00000001, 1, msg.sender, msg.value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: BURN_FAILED');
        _mint(msg.sender, msg.value);
    }

    function unwrap(uint256 amount) public noReentrant {
        require(balanceOf(msg.sender) >= amount,
            "PAYMENT_ABORT"
        );
        (bool success, bytes memory data) = address(this).call(abi.encodeWithSelector(0x00000001, 0, msg.sender, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: BURN_FAILED');
        _burn(msg.sender, amount);
    }

    function initTransfer(uint256 quantity, string calldata toChain) public payable noReentrant activated {
        require(quantity >= minimumTransferQuantity,
            "INSUFISANT_QUANTITY"
        );
        require(msg.value >= getFeesInETH().mul(90).div(100),
            "PAYMENT_ABORT" // 90% of the fees minimum
        );
        require(balanceOf(msg.sender) >= quantity, "INSUFISANT_BALANCE");
        require(allowance(msg.sender, address(this)) >= quantity, "INSUFISANT_ALLOWANCE");
        _burn(msg.sender, quantity);
        emit BridgeTransfer(quantity, toChain);
    }

    function deposit(address coin, uint256 quantity) public onlyOwner noReentrant {
        require(IERC20(coin).balanceOf(msg.sender) >= quantity, "INSUFISANT_BALANCE");
        require(IERC20(coin).allowance(msg.sender, address(this)) >= quantity, "INSUFISANT_ALLOWANCE");
        TransferHelper.safeTransferFrom(coin, msg.sender, address(this), quantity);
    }

    function balance() public view returns (uint256){
        return payable(address(this)).balance;
    }

    function getFees() public view returns (uint256) {
        return balance();
    }

    function claimFees() public onlyOwner noReentrant {
        (bool success,)=owner.call{value:balance()}("");
        require(success, "BridgeTransfer failed!");
    }

    function setTransferProcessed(address sender, uint256 transferBn) private {
        transfers[sender][transferBn] = true;
    }

    function isTransferProcessed(address sender, uint256 transferBn) public view returns (bool) {
        return transfers[sender][transferBn];
    }

    function addTransferFrom(address to, uint256 amount, uint256 bn) public onlyProgramOrOwner {
        require(isTransferProcessed(to, bn) == false, "Bridge request already processed.");

        setTransferProcessed(to, bn);
        _mint(to, amount);
    }

    function getDex() public view returns (address, address, address) {
        return (dex_in, dex_out, dex_pool);
    }

    /**
     * Only 18 decimals tokens.
     */
    function setDex(address _in, address _out, address _pool) public onlyOwner {
        dex_in = _in;
        dex_out = _out;
        dex_pool = _pool;
    }

    function getTokenPriceOutFromPoolBalance(address _in, address _out, address _pool) public view returns (uint256) {
        uint256 balanceIn = IERC20(_in).balanceOf(_pool);
        uint256 balanceOut = IERC20(_out).balanceOf(_pool);
        require(balanceOut > 0);
        return balanceIn.mul(1 ether).div(balanceOut);
        // ex: in=USDC,out=ETH = price of ETH in USDC
        // ex: in=ETH,out=USDC = price of USDC in ETH
    }

    function updateTransferCost(uint256 _feesInDollar) public onlyOwner {
        feesInDollar = _feesInDollar;
    }

    function isPaused() public view returns (bool) {
        return paused;
    }

    function setPaused(bool p) public onlyOwner {
        paused = p;
    }

    function setMinimumTransferQuantity(uint256 quantity) public onlyOwner {
        minimumTransferQuantity = quantity;
    }

    function changeOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "No zero address");
        owner = newOwner;
    }

    function changeProgram(address newProgram) public onlyOwner {
        require(newProgram != address(0), "No zero address");
        program = newProgram;
    }

    function _getHash(uint256 timestamp, uint256 nonce, address addr) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(timestamp, addr, nonce));
    }
}