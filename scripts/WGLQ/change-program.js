const hre = require("hardhat");

async function main() {

  const bridgeAddress = "0xEB567ec41738c2bAb2599A1070FC5B727721b3B6";
  const BridgeContract = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(bridgeAddress);
  const tx = await BridgeContract.changeProgram(
    "0x3251E809d4bD3E32d9CF199B8D8c856E97007D32"
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