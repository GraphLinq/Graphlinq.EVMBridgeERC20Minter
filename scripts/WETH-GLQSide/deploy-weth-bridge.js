const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0x5fa8180D5a7D77822c7c498a1385a942DaD929Bf
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeERC20Minter");
  const bridge = await BridgeContract.deploy(
    "GLQ", // chain
    "10000000000000000000", // 10 Dollars
    "1000000000000000", // 0,001 WETH
    "Wrapped Ethereum", // Name
    "WETH" // Symbol
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