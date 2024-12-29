const hre = require("hardhat");

async function main() {
  const bridgeAddress = '0x991Dd4aaeE99b175226C7B22885564780dE46141';// WETH Proxy
  // const bridgeAddress = '0x7b22018B0a049527959E659ea4DD2E87b560312c';// WGLQ Bridge
  const amount = ethers.utils.parseEther("0.7417148618185852");
  const accountAddress = '0x85fa20a22C62C55eaD39d5697111162aBAfc0219';
  // node 1 (WGLQ)
  const bridge = await (await ethers.getContractFactory("EVMBridgeConnectedToERC20Minter")).attach(bridgeAddress);

  // Mint WGLQ (ex: transfer of WGLQ from another chain will create WGLQ)
  // Need Owner role 0xBd510d1DD4857061B092420039B44Ca20366F7Fd
  const result = (await bridge.addTransferFrom(accountAddress, amount.toString(), "2"));
  console.log(`minted!`, await result.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});