import { ethers } from "hardhat";

async function main() {
  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const nokTokenAddress = "0x455e7020Dad8cF6FD17C7Bcd8Aa97A86968d739D";
  const nokSecTokenAddress = "0x45b96521b9bB38c6C677Ae08A22aE5079D2aA992";
  const tokenSwap = await TokenSwap.deploy(nokTokenAddress, nokSecTokenAddress);

  await tokenSwap.deployed();

  // console.log("Disperse deployed to:", tokenSwap.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
