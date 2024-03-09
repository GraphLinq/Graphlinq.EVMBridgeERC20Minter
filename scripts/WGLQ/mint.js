const hre = require("hardhat");

async function main() {
  // const bridgeAddress = '0x1973006F6bA037e70967A1bB2A15c5432361c5fE';// WETH
  const bridgeAddress = '0x3251E809d4bD3E32d9CF199B8D8c856E97007D32';// WGLQ Bridge
  const amount = ethers.utils.parseEther("1");
  const accountAddress = '0x527E6fcE820f90AC907512Bbc5279d243e07Ae1f';
  // node 1 (WGLQ)
  const bridge = await (await ethers.getContractFactory("EVMBridgeWGLQ")).attach(bridgeAddress);

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