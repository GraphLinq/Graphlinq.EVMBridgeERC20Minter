const hre = require("hardhat");

async function main() {

  const bridgeAddress = "0x991Dd4aaeE99b175226C7B22885564780dE46141";
  const BridgeContract = await (await ethers.getContractFactory("EVMBridge")).attach(bridgeAddress);
  const tx = await BridgeContract.setMinimumTransferQuantity(
    "100000000000000"
  );

  console.log(tx);
  console.log("actual minimumTransferQuantity", await BridgeContract.minimumTransferQuantity());
  const awaitResultBurn = await tx.wait();

  console.log(
    awaitResultBurn
  );
  console.log("new minimumTransferQuantity", await BridgeContract.minimumTransferQuantity());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});