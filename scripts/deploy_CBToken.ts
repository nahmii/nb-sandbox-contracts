import { ethers } from "hardhat";

async function main() {
  const CBToken = await ethers.getContractFactory("CBToken");
  const token = await CBToken.deploy("CBToken", "CBT", 18);

  await token.deployed();

  console.log("Token deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
