const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0xC8EdbF35e7D8F641a31B7ddEe018e0153fB46e9d
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeConnectedToERC20Minter");
  const bridge = await BridgeContract.deploy(
    "0xbd8d94c4C34115641B2Cc70D1E42e299f78A22cB", // USDT
    "GLQ", // chain
    "10000000000000000000", // 10 Dollars
    "1000000000000" // 1 USDT
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