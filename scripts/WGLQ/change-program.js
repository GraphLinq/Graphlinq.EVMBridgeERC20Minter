const hre = require("hardhat");

async function main() {

  const bridgeAddress = "0xbeED106D0f2e6950BFa1Eec74E1253CA0a643442";
  const BridgeContract = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(bridgeAddress);
  const tx = await BridgeContract.changeProgram(
    "0x991Dd4aaeE99b175226C7B22885564780dE46141"
  );

  console.log(tx);
  console.log("actual Program", await BridgeContract.program());
  const awaitResultBurn = await tx.wait();

  console.log(
    awaitResultBurn
  );
  console.log("new Program", await BridgeContract.program());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});