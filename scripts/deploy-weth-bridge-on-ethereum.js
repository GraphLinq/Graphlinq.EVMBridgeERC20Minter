const hre = require("hardhat");

async function main() {
  const chain = "ETH";

  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeNative");
  const bridge = await BridgeContract.deploy(chain,
    "0",// "10000000000000000000",
    "0x0000000000000000000000000000000000000000",//"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x0000000000000000000000000000000000000000",//"0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0x0000000000000000000000000000000000000000");//"0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11");

  console.log(bridge);

  await bridge.deployed();

  console.log(
    `Bridge deployed to ${bridge.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});