const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0xbd8d94c4C34115641B2Cc70D1E42e299f78A22cB
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeERC20Minter");
  const bridge = await BridgeContract.deploy(
    "GLQ", // chain
    "10000000000000000000", // 10 Dollars
    "1000000000000", // 0,000001 USDT
    "Tether USD", // Name
    "USDT" // Symbol
  );

  console.log(bridge);

  await bridge.deployed();

  console.log(
    `Token deployed to ${bridge.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});