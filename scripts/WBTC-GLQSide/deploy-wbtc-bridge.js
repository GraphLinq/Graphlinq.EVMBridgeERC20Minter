const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0x95a77d7A2Ae1f861a48Dc2d5Cb7D9C60EE81fD99
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeConnectedToERC20Minter");
  const bridge = await BridgeContract.deploy(
    "0x6518E3160eFC496CD3451eC4aE52E99cfee20697", // WBTC
    "GLQ", // chain
    "10000000000000000000", // 10 Dollars
    "1000000000000" // 1 GLQ
  );

  console.log(bridge);

  await bridge.deployed();

  console.log(
    `WETHBridge deployed to ${bridge.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});