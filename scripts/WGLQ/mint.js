const hre = require("hardhat");

async function main() {
  // const bridgeAddress = '0x1973006F6bA037e70967A1bB2A15c5432361c5fE';// WETH
  const bridgeAddress = '0x7b22018B0a049527959E659ea4DD2E87b560312c';// WGLQ Bridge
  const amount = ethers.utils.parseEther("1");
  const accountAddress = '0x193BBDB1f9CA5CfD3C13634Fb994d37703da71e1';
  // node 1 (WGLQ)
  const bridge = await (await ethers.getContractFactory("EVMBridgeConnectedToERC20Minter")).attach(bridgeAddress);

  // Mint WGLQ (ex: transfer of WGLQ from another chain will create WGLQ)
  // Need Owner role 0xBd510d1DD4857061B092420039B44Ca20366F7Fd
  const result = (await bridge.addTransferFrom(accountAddress, amount.toString(), "1"));
  console.log(`minted!`, await result.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});