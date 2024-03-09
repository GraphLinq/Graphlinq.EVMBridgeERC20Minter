const hre = require("hardhat");

async function main() {

  const bridgeAddress = "0x68C46be29102850d85786f2c3C01Cf2bEDb48db5";
  const BridgeContract = await (await ethers.getContractFactory("EVMBridgeNative")).attach(bridgeAddress);
  const tx = await BridgeContract.changeProgram(
    "0x32152293EE2Cd23F72627339707C265949bb4a28"
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