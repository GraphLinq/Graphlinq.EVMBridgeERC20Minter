const hre = require("hardhat");

async function main() {
  const bridge = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach("0x1718011cEAc9Cdc4e95021d2c611E98344AE78F9")


  //string[] memory /* fromChains */, address[] memory transfersAddresses, uint256[] memory amounts, bytes32[] memory _transfersHashs
  const result = (await bridge.addTransfersFrom([], ["0xBd510d1DD4857061B092420039B44Ca20366F7Fd"], ["100000000000000000000"], ["0x26e6c593ca5713ca2f1a03d2653ecb2df3e44646fb871de64893e103909fc092"]));

  // const result = (await bridge.approve("0x1718011cEAc9Cdc4e95021d2c611E98344AE78F9", "100000000000000000000"));

  // const result = (await bridge.unwrap("100000000000000000000"))//{ value: "1000000000000000000000000000" }));//649989487.9

  // const result = (await bridge.wrap({ value: "100000000000000000000" }))

  console.log(
    `BLAALLA`, result
  );
  console.log(
    `BLAALLA2`, await result.wait()
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});