const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0x
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridge");
  const bridge = await BridgeContract.deploy(
    "ETH", // chain
    "0x9F9c8ec3534c3cE16F928381372BfbFBFb9F4D24", // token Address GLQ Ethereum
    "10000000000000000000", // 10 Dollars
    "1000000000000000000", // 1 GLQ
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