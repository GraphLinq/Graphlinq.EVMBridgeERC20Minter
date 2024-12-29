const hre = require("hardhat");

async function main() {

  const bridgeAddress = "0xbd8d94c4C34115641B2Cc70D1E42e299f78A22cB";
  const BridgeContract = await (await ethers.getContractFactory("EVMBridgeNative")).attach(bridgeAddress);
  const tx = await BridgeContract.changeProgram(
    "0xC8EdbF35e7D8F641a31B7ddEe018e0153fB46e9d"
  );

  console.log(tx);
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