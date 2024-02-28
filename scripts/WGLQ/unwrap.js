const hre = require("hardhat");

async function main() {
  const bridgeAddress = '0xEB567ec41738c2bAb2599A1070FC5B727721b3B6';
  const amount = ethers.utils.parseEther("10000");
  // node 1 (WGLQ)
  const bridge = await (await ethers.getContractFactory("EVMBridgeERC20Minter")).attach(bridgeAddress);

  // Unwrap WGLQ to Native GLQ
  const result = (await bridge.unwrap(amount.toString()));
  console.log(`unwrapped!`, await result.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});