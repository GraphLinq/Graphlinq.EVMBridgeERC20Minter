const hre = require("hardhat");

async function main() {

  const contractAddress = "0x6518E3160eFC496CD3451eC4aE52E99cfee20697";
  const TokenContract = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(contractAddress);
  const tx = await TokenContract.changeProgram(
    "0x95a77d7A2Ae1f861a48Dc2d5Cb7D9C60EE81fD99"
  );

  console.log(tx);
  console.log("actual Program", await TokenContract.program());
  const awaitResultBurn = await tx.wait();

  console.log(
    awaitResultBurn
  );
  console.log("new Program", await TokenContract.program());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});