const hre = require("hardhat");

async function main() {
    const bridgeAddress = '0xEB567ec41738c2bAb2599A1070FC5B727721b3B6';
    const amount = ethers.utils.parseEther("10000");
    const accountAddress = '0x501cc8C7A15920D082d69819B3815d962f518fe7';
    // node 1 (WGLQ)
    const bridge = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(bridgeAddress);

    // Burn WGLQ (ex: simulate transfer to Unknown blockchain)
    // no right needed
    const result = (await bridge.approve(bridgeAddress, amount.toString()));
    const awaitResult = await result.wait();
    console.log('Approved!', awaitResult);

    const resultBurn = (await bridge.initTransfer(amount.toString(), "Unknown", accountAddress));
    const awaitResultBurn = await resultBurn.wait();
    console.log('Burnt!', awaitResultBurn);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});