const hre = require("hardhat");

async function main() {
  const chain = "GLQ";
  // const dex = {
  //     in: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // in (WAVAX)
  //     out: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', // out (DAI.e) Important Only 18 decimals!
  //     pool: '0x87Dee1cC9FFd464B79e058ba20387c1984aed86a' // DAI.e/WAVAX Trade joe Pair
  // };

  const BridgeContract = await hre.ethers.getContractFactory("EVMBridgeERC20Minter");
  const bridge = await BridgeContract.deploy(
    chain,
    "Wrapped Graphlinq GLQ",
    "WGLQ"
  );

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