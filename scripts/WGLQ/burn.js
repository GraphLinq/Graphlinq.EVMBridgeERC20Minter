const hre = require("hardhat");

async function main() {
    const bridgeAddress = '0x3796C8bb3e9f9CD78170138Cb96829439eD356b5';
    const amount = ethers.utils.parseEther("1");
    // node 1 (WGLQ)
    const bridge = await (await ethers.getContractFactory("EVMBridgeConnectedToERC20Minter")).attach(bridgeAddress);

    const wglqAddress = '0xEB567ec41738c2bAb2599A1070FC5B727721b3B6';
    const wglqContract = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(wglqAddress);

    // Burn WGLQ (ex: simulate transfer to Unknown blockchain)
    // no right needed
    const aal = await wglqContract.allowance('0x1D3851e86293f7A80B5aaB881F6323C4Dff27D78', bridgeAddress);
    console.log(aal.toString());
    // const result = (await wglqContract.approve(bridgeAddress, amount.toString()));
    // const awaitResult = await result.wait();
    // console.log('Approved!', awaitResult);

    // const resultBurn = (await bridge.initTransfer(amount.toString(), "WGLQ_ETH"));
    // const awaitResultBurn = await resultBurn.wait();
    // console.log('Burnt!', awaitResultBurn);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});