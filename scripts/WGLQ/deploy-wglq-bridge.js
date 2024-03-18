const hre = require("hardhat");

async function main() {
  // DEPLOYED => 0xa5404410d93B5D30D1888Ed107129BFE81705153
  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeConnectedToERC20Minter");
  const bridge = await BridgeContract.deploy(
    "0xEB567ec41738c2bAb2599A1070FC5B727721b3B6", // WGLQ token
    "GLQ", // chain
    "10000000000000000000", // 10 Dollars
    "1000000000000000000" // 1 GLQ
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