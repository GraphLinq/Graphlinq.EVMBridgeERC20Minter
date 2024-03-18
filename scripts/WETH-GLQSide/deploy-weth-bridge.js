const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0x2D8731a84bcD49c615e9540896240e8d3F012B3A
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeConnectedToERC20Minter");
  const bridge = await BridgeContract.deploy(
    "0xbeED106D0f2e6950BFa1Eec74E1253CA0a643442", // WETH
    "GLQ", // chain
    "10000000000000000000", // 10 Dollars
    "1000000000000000000" // 1 GLQ
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