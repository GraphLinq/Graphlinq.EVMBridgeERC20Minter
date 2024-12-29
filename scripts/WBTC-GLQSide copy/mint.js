const hre = require("hardhat");

async function main() {
  const bridgeAddress = '0x6518E3160eFC496CD3451eC4aE52E99cfee20697';// WBTC Bridge
  const amount = ethers.utils.parseEther("1");
  const accountAddress = '0x1D3851e86293f7A80B5aaB881F6323C4Dff27D78';
  // node 1 (WGLQ)
  const bridge = await (await ethers.getContractFactory("EVMBridgeConnectedToERC20Minter")).attach(bridgeAddress);

  // Mint WGLQ (ex: transfer of WGLQ from another chain will create WGLQ)
  const result = (await bridge.addTransferFrom(accountAddress, amount.toString(), "1"));
  console.log(`minted!`, await result.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});