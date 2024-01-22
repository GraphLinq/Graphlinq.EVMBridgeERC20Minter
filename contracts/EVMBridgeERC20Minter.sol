// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "./erc20/ERC20.sol";
import "./utils/TransferHelper.sol";
import "./libs/SafeMath.sol";
import "./libs/SignedSafeMath.sol";

struct BridgeTransfer {
    bytes32 hash;
    address from;
    address coin;
    uint256 quantity;
    string  fromChain;
    string  toChain;
    uint256 feesInToken;
    uint256 feesInETH;
    uint256 blockTimestamp;
    uint256 blockNumber;
    string  data;
}

struct Bridge {
    address addr;
    string chain;
}

struct Validator {
    address addr;
    uint256 warrantyAmount;
    uint256 totalLossAmount;
}

contract EVMBridgeERC20Minter is ERC20 {

    using SafeMath for uint256;
    using SignedSafeMath for int256;

    address public owner;
    address public program;
    string  public chain;

    uint256 public feesInDollar;
    uint256 public minimumTransferQuantity;

    uint256 private blocksLength;
    mapping(bytes32 => uint256) private transfersIndexs;
    BridgeTransfer[] private transfers;
    mapping(bytes32 => bytes32) private transfersHashs;

    // Private dex information
    address private dex_in;
    address private dex_out;
    address private dex_pool;

    bool internal paused;
    bool internal locked;

    event NewBridgeTransferEvent(bytes32 hash);

    constructor(string memory _bridgeChain, string memory name, string memory symbol) ERC20(name, symbol, 0, 18) {
        require(_msgSender() != address(0), "Bridge: deploy from the zero address");
        owner = _msgSender();
        program = _msgSender();
        chain = _bridgeChain;
        minimumTransferQuantity = 1 ether;
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

    function getFeesInETH() public view returns (uint256) {
        if (dex_pool != address(0)) {
            uint256 oneDollar = getTokenPriceOutFromPoolBalance(dex_in, dex_out, dex_pool);
            return oneDollar.mul(1 ether).div(feesInDollar).mul(100); // multiplication 1 ether pour decaler les decimals.
        }
        return 0;
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
    
    function initTransfer(uint256 quantity, string calldata toChain, string calldata data) public payable noReentrant activated {
        require(msg.value >= getFeesInETH(),
            "PAYMENT_ABORT"
        );
        require(quantity >= minimumTransferQuantity,
            "INSUFISANT_QUANTITY"
        );
        require(balanceOf(msg.sender) >= quantity, "INSUFISANT_BALANCE");
        require(allowance(msg.sender, address(this)) >= quantity, "INSUFISANT_ALLOWANCE");
        _burn(msg.sender, quantity);

        uint256 transferQuantity = quantity;
        uint256 transferETHFees = msg.value;
        uint256 index = transfers.length;
        bytes32 transferHash = _getHash(block.timestamp, 0, msg.sender);

        transfers.push(BridgeTransfer(
            transferHash,
            msg.sender,
            address(this),
            transferQuantity,
            chain,
            toChain,
            0,
            transferETHFees,
            block.timestamp,
            block.number,
            data
        ));
        transfersIndexs[transferHash] = index;
        transfersHashs[transferHash] = transferHash;
        emit NewBridgeTransferEvent(transferHash);
    }

    function transferExists(bytes32 transferHash) public view returns (bool) {
        return transfersHashs[transferHash] == transferHash;
    }

    function getTransfer(bytes32 transferHash) public view returns (BridgeTransfer memory) {
        return transfers[transfersIndexs[transferHash]];
    }

    function getTransferLength() public view returns (uint256) {
        return transfers.length;
    }

    function getTransfers(int256 page, int256 pageSize) external view returns (BridgeTransfer[] memory) {
        uint256 poolLength = transfers.length;
        int256 queryStartPoolIndex = int256(poolLength).sub(pageSize.mul(page.add(1))).add(pageSize);
        require(queryStartPoolIndex >= 0, "Out of bounds");
        int256 queryEndPoolIndex = queryStartPoolIndex.sub(pageSize);
        if (queryEndPoolIndex < 0) {
            queryEndPoolIndex = 0;
        }
        int256 currentPoolIndex = queryStartPoolIndex;
        require(uint256(currentPoolIndex) <= poolLength, "Out of bounds");
        BridgeTransfer[] memory results = new BridgeTransfer[](uint256(currentPoolIndex - queryEndPoolIndex));
        uint256 index = 0;

        for (currentPoolIndex; currentPoolIndex > queryEndPoolIndex; currentPoolIndex--) {
            BridgeTransfer memory transfer = transfers[uint256(currentPoolIndex).sub(1)];
            results[index] = transfer;
            index++;
        }
        return results;
    }

    function deposit(address coin, uint256 quantity) public onlyOwner noReentrant {
        require(IERC20(coin).balanceOf(msg.sender) >= quantity, "INSUFISANT_BALANCE");
        require(IERC20(coin).allowance(msg.sender, address(this)) >= quantity, "INSUFISANT_ALLOWANCE");
        TransferHelper.safeTransferFrom(coin, msg.sender, address(this), quantity);
    }

    function balance() public view returns (uint256){
        return payable(address(this)).balance;
    }

    function depositETH(uint256 quantity) public payable onlyOwner noReentrant {
        require(msg.value >= quantity,
            "PAYMENT_ABORT"
        );
    }

    function withdrawETH(uint quantity) public onlyOwner noReentrant {
        require(quantity <= balance(), "Insufficient balance");
        (bool success,)=owner.call{value:quantity}("");
        require(success, "BridgeTransfer failed!");
    }

    function getLastsTransfers(uint256 size) external view returns (BridgeTransfer[] memory) {
        uint256 poolLength = transfers.length;
        uint256 start = 0;
        uint256 memorySize = size;

        if (transfers.length > size) {
            start = transfers.length.sub(size);
        } else {
            memorySize = transfers.length;
        }
        uint256 currentIndex = start;
        BridgeTransfer[] memory results = new BridgeTransfer[](memorySize);
        uint256 memoryIndex = 0;

        for (currentIndex; currentIndex < poolLength; currentIndex++) {
            BridgeTransfer memory transfer = transfers[currentIndex];
            results[memoryIndex++] = transfer;
        }
        return results;
    }

    function addTransfersFrom(string[] memory /* fromChains */, address[] memory transfersAddresses, uint256[] memory amounts, bytes32[] memory _transfersHashs) public onlyProgramOrOwner {
        for (uint256 i = 0; i < transfersAddresses.length; i++) {
            address transferAddress = transfersAddresses[i];
            uint256 amount = amounts[i];
            bytes32 transferHash = _transfersHashs[i];

            require(transfersHashs[transferHash] == 0, "Already transfered");
            _mint(transferAddress, amount);
            transfersHashs[transferHash] = transferHash;
        }
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