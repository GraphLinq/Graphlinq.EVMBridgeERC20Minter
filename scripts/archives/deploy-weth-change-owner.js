const hre = require("hardhat");

async function main() {

  const bridgeAddress = "0xEB567ec41738c2bAb2599A1070FC5B727721b3B6";
  const BridgeContract = await (await ethers.getContractFactory("EVMBridgeNative")).attach(bridgeAddress);
  // const tx = await BridgeContract.changeOwner(
  //   "0x32152293EE2Cd23F72627339707C265949bb4a28"
  // );

  // console.log(tx);
  // const awaitResultBurn = await tx.wait();

  // console.log(
  //   awaitResultBurn
  // );
  console.log("Owner", await BridgeContract.owner());
  console.log("Program", await BridgeContract.program());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});