const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0x6B14854D4b194Cd2D77D8A8952B977dcCdf74042
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridge");
  const bridge = await BridgeContract.deploy(
    "ETH", // chain
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // token Address USDT Ethereum
    "10000000000000000000", // 10 Dollars
    "1000000000000000000", // 1 USDT
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