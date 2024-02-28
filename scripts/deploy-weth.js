const hre = require("hardhat");

async function main() {
  const chain = "GLQ";

  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeERC20Minter");
  const bridge = await BridgeContract.deploy(
    chain,
    "Wrapped Ethereum",
    "WETH"
  );

  console.log(bridge);

  await bridge.deployed();

  console.log(
    `Bridge deployed to ${bridge.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});