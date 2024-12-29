const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0x6518E3160eFC496CD3451eC4aE52E99cfee20697
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeERC20Minter");
  const bridge = await BridgeContract.deploy(
    "GLQ", // chain
    "10000000000000000000", // 10 Dollars
    "1000000000000", // 0,000001 BTC
    "Wrapped Bitcoin", // Name
    "WBTC" // Symbol
  );

  console.log(bridge);

  await bridge.deployed();

  console.log(
    `WGLQBridge deployed to ${bridge.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});