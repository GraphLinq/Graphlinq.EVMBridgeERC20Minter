const hre = require("hardhat");

async function main() {
    const bridgeAddress = '0x3251E809d4bD3E32d9CF199B8D8c856E97007D32';
    const amount = ethers.utils.parseEther("1");
    // node 1 (WGLQ)
    const bridge = await (await ethers.getContractFactory("EVMBridgeWGLQ")).attach(bridgeAddress);

    const wglqAddress = '0xEB567ec41738c2bAb2599A1070FC5B727721b3B6';
    const wglqContract = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(wglqAddress);

    // Burn WGLQ (ex: simulate transfer to Unknown blockchain)
    // no right needed
    const result = (await wglqContract.approve(bridgeAddress, amount.toString()));
    const awaitResult = await result.wait();
    console.log('Approved!', awaitResult);

    const resultBurn = (await bridge.initTransfer(amount.toString(), "Unknown"));
    const awaitResultBurn = await resultBurn.wait();
    console.log('Burnt!', awaitResultBurn);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});