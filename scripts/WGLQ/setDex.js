const hre = require("hardhat");

async function main() {

  const dex = {
    in: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // in (WAVAX)
    out: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // out (DAI.e) Important Only 18 decimals!
    pool: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11' // DAI.e/WAVAX Trade joe Pair
};

  const bridgeAddress = "0x379D5fDD6808CE6Fc7E1450F85c98c8312CC82ca";
  const BridgeContract = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(bridgeAddress);
  
  const tx = await BridgeContract.setDex(
    dex.in,
    dex.out,
    dex.pool
  );

  console.log(tx);
  console.log("actual Dex", await BridgeContract.getDex());
  const awaitResultBurn = await tx.wait();

  console.log(
    awaitResultBurn
  );
  console.log("new Dex", await BridgeContract.getDex());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});