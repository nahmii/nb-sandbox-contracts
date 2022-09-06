import { expect } from "chai";
import { ethers } from "hardhat";
const hre = require("hardhat");

const { BigNumber } = require("@ethersproject/bignumber");

const ETHER = BigNumber.from(10).pow(BigNumber.from(18));
const getTokenValue = (value: number) => BigNumber.from(value).mul(ETHER);

async function main() {
  const erc1400ContractAddress = `${process.env.ERC1400_TOKEN_ADDRESS}`;
  const tokenSwapAddress = `${process.env.TOKEN_SWAP_ADDRESS}`;

  const contract = await ethers.getContractAt(
    "ERC1400",
    erc1400ContractAddress
  );
  const addMinter = await contract.addMinter(tokenSwapAddress);
  await addMinter.wait();
  console.log("isMinter", await contract.isMinter(tokenSwapAddress));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
