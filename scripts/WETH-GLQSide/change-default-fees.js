const hre = require("hardhat");

async function main() {

  const bridgeAddress = "0x2Cc11d0be3c9d3Ed82F033065821a2250f99885F";
  const BridgeContract = await (await ethers.getContractFactory("EVMBridge")).attach(bridgeAddress);
  const tx = await BridgeContract.setDefaultFeesInETH(
    "66000000000000000000"
  ); // 66 GLQ

  console.log(tx);
  console.log("actual defaultFeesInETH", await BridgeContract.defaultFeesInETH());
  const awaitResultBurn = await tx.wait();

  console.log(
    awaitResultBurn
  );
  console.log("new defaultFeesInETH", await BridgeContract.defaultFeesInETH());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});