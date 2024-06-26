const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0x
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeNative");
  const bridge = await BridgeContract.deploy(
    "ETH",
    "0x0000000000000000000000000000000000000000",
    "10000000000000000000", // 10 Dollars
    "100000000000000" // 0,0001 WETH
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