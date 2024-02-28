const hre = require("hardhat");

async function main() {
  const bridgeAddress = '0x1973006F6bA037e70967A1bB2A15c5432361c5fE';// WETH
  // const bridgeAddress = '0xEB567ec41738c2bAb2599A1070FC5B727721b3B6';// WGLQ
  const amount = ethers.utils.parseEther("10000");
  const accountAddress = '0x1D3851e86293f7A80B5aaB881F6323C4Dff27D78';
  // node 1 (WGLQ)
  const bridge = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(bridgeAddress);

  // Mint WGLQ (ex: transfer of WGLQ from another chain will create WGLQ)
  // Need Owner role 0xBd510d1DD4857061B092420039B44Ca20366F7Fd
  const result = (await bridge.addTransfersFrom([], [accountAddress], [amount.toString()], ["0x0000000000000000000000000000000000000000000000000000000000000000"]));
  console.log(`minted!`, await result.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});