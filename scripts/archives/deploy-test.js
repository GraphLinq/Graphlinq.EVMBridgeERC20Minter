const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  const bridgeAddress = '0xbeED106D0f2e6950BFa1Eec74E1253CA0a643442';
  const BridgeContract = await (await hre.ethers.getContractFactory("EVMBridgeERC20Minter")).attach(bridgeAddress);;
  const amount = ethers.utils.parseEther("0.001").toString();

  const data = await BridgeContract.setMinimumTransferQuantity(amount);

  console.log(await data.wait());

  console.log('minimumTransferQuantity', (await BridgeContract.minimumTransferQuantity()).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});