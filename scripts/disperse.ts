import { ethers } from "hardhat";

async function main() {
  const Disperse = await ethers.getContractFactory("Disperse");
  const disperse = await Disperse.deploy();

  await disperse.deployed();

  console.log("Disperse deployed to:", disperse.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
