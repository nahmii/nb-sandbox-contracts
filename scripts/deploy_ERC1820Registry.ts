import { ethers } from "hardhat";

async function main() {
  const ERC1820Registry = await ethers.getContractFactory("ERC1820Registry");
  const contract = await ERC1820Registry.deploy();

  await contract.deployed();

  console.log("ERC1820Registry deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
