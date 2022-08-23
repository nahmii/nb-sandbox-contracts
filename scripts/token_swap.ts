import { ethers } from "hardhat";

async function main() {
  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const cBTokenAddress = `${process.env.cBTokenAddress}`;
  const cBSTokenAddress = `${process.env.cBSTokenAddress}`;
  const tokenSwap = await TokenSwap.deploy(cBTokenAddress, cBSTokenAddress);

  await tokenSwap.deployed();

  console.log("TokenSwap deployed to:", tokenSwap.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
